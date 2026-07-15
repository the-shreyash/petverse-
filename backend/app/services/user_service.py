"""
app/services/user_service.py

Account-lifecycle orchestration: change password, deactivate, delete.

Password changes are NOT reimplemented here — ``AuthService.change_password``
already owns hashing, verification, and session revocation, so this service
simply delegates to it. Deactivate/delete are net-new B3 behaviour and follow
the same pattern: verify the current password (re-authentication for a
destructive action), flip the relevant flag, and revoke every existing session
so a leaked/valid access token can't keep acting as the user afterwards.
"""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.exceptions.auth import InvalidCredentialsException
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.password_service import PasswordService
from app.services.token_service import TokenService
from app.utils.datetime_helper import utcnow

logger = get_logger(__name__)


class UserService:
    """Account-level actions on the authenticated user."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.users = UserRepository(session)
        self.tokens = TokenService(session)
        self.passwords = PasswordService()
        self.auth = AuthService(session)

    async def change_password(
        self, user: User, current_password: str, new_password: str
    ) -> None:
        """Thin delegate to ``AuthService`` — no password logic duplicated here."""
        await self.auth.change_password(user, current_password, new_password)

    async def _verify_password(self, user: User, password: str) -> None:
        if not self.passwords.verify(password, user.password_hash or ""):
            raise InvalidCredentialsException("Password is incorrect.")

    async def deactivate_account(self, user: User, password: str) -> User:
        """Soft-disable the account (reversible by an admin/support flow later)."""
        await self._verify_password(user, password)

        user.is_active = False
        user = await self.users.save(user)
        await self.tokens.revoke_all_for_user(user.id)

        logger.info("Account deactivated | id=%s", user.id)
        return user

    async def delete_account(self, user: User, password: str) -> User:
        """
        Soft-delete the account. Never a hard DELETE — every other module keys
        off ``user_id`` and future GDPR export/erasure tooling needs the row.
        """
        await self._verify_password(user, password)

        user.is_deleted = True
        user.deleted_at = utcnow()
        user.is_active = False
        user = await self.users.save(user)
        await self.tokens.revoke_all_for_user(user.id)

        logger.info("Account soft-deleted | id=%s", user.id)
        return user
