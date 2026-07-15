"""
app/repositories/token_repository.py

Data-access layer for refresh tokens and verification tokens.

Both repositories store/lookup by the SHA-256 *hash* of the token — the raw
token never touches the database.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.enums import VerificationTokenType
from app.modules.auth.models.refresh_token import RefreshToken
from app.modules.auth.models.verification_token import VerificationToken
from app.utils.datetime_helper import utcnow


from app.core.repository import BaseRepository

class RefreshTokenRepository(BaseRepository[RefreshToken]):
    """Persistence for issued refresh tokens (enables logout & rotation)."""

    def __init__(self, session: AsyncSession):
        super().__init__(RefreshToken, session)

    async def create(
        self, *, user_id: str, token_hash: str, expires_at: datetime
    ) -> RefreshToken:
        token = RefreshToken(
            user_id=user_id, token_hash=token_hash, expires_at=expires_at
        )
        return await super().add(token)

    async def get_by_hash(self, token_hash: str) -> Optional[RefreshToken]:
        result = await self.session.execute(
            select(RefreshToken).where(RefreshToken.token_hash == token_hash)
        )
        return result.scalar_one_or_none()

    async def revoke(self, token: RefreshToken) -> None:
        token.revoked = True
        self.session.add(token)
        await self.session.flush()

    async def revoke_all_for_user(self, user_id: str) -> None:
        """Revoke every active refresh token for a user (e.g. on password change)."""
        await self.session.execute(
            update(RefreshToken)
            .where(RefreshToken.user_id == user_id, RefreshToken.revoked.is_(False))
            .values(revoked=True)
        )
        await self.session.flush()


class VerificationTokenRepository(BaseRepository[VerificationToken]):
    """Persistence for single-use email-verification / password-reset tokens."""

    def __init__(self, session: AsyncSession):
        super().__init__(VerificationToken, session)

    async def create(
        self,
        *,
        user_id: str,
        token_hash: str,
        token_type: VerificationTokenType,
        expires_at: datetime,
    ) -> VerificationToken:
        token = VerificationToken(
            user_id=user_id,
            token_hash=token_hash,
            token_type=token_type,
            expires_at=expires_at,
        )
        return await super().add(token)

    async def get_active(
        self, token_hash: str, token_type: VerificationTokenType
    ) -> Optional[VerificationToken]:
        """
        Return the token row if it exists, matches the expected type, has not
        been used, and has not expired — otherwise ``None``.
        """
        result = await self.session.execute(
            select(VerificationToken).where(
                VerificationToken.token_hash == token_hash,
                VerificationToken.token_type == token_type,
                VerificationToken.used_at.is_(None),
                VerificationToken.expires_at > utcnow(),
            )
        )
        return result.scalar_one_or_none()

    async def mark_used(self, token: VerificationToken) -> None:
        token.used_at = utcnow()
        self.session.add(token)
        await self.session.flush()

    async def invalidate_outstanding(
        self, user_id: str, token_type: VerificationTokenType
    ) -> None:
        """
        Burn any still-valid tokens of this type for the user before issuing a
        new one, so only the most recent link ever works.
        """
        await self.session.execute(
            update(VerificationToken)
            .where(
                VerificationToken.user_id == user_id,
                VerificationToken.token_type == token_type,
                VerificationToken.used_at.is_(None),
            )
            .values(used_at=utcnow())
        )
        await self.session.flush()
