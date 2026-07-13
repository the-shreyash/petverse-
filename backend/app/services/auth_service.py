"""
app/services/auth_service.py

The orchestration layer for the Identity module. Routers call ``AuthService``;
``AuthService`` coordinates the repositories and the Password/Token/Email
services. This is where the business rules live (uniqueness, credential checks,
account state, what to revoke when).

Transaction model: every method runs inside the request-scoped session opened by
``get_db``, which commits on success and rolls back on any raised exception. So
a partially-completed register (user inserted, token insert fails) is never
persisted — the whole request is atomic.
"""

from __future__ import annotations

from typing import Optional, Tuple

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.exceptions.auth import (
    EmailAlreadyExistsException,
    InactiveUserException,
    InvalidCredentialsException,
    InvalidTokenException,
    UsernameAlreadyExistsException,
)
from app.models.enums import AuthProvider, UserRole, VerificationTokenType
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenPair,
)
from app.services.email_service import EmailService
from app.services.password_service import PasswordService
from app.services.token_service import TokenService
from app.utils.datetime_helper import utcnow
from app.utils.security import generate_secure_token

logger = get_logger(__name__)


class AuthService:
    """Coordinates all authentication use-cases."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.users = UserRepository(session)
        self.tokens = TokenService(session)
        self.passwords = PasswordService()
        self.emails = EmailService()

    # ─── Registration ─────────────────────────────────────────────────────────

    async def register(self, payload: RegisterRequest) -> Tuple[User, TokenPair]:
        """
        Create a new local account.

        Uniqueness is checked explicitly (friendly 409s) AND guarded by DB unique
        constraints (the ultimate race-condition backstop).
        """
        if await self.users.email_exists(payload.email):
            raise EmailAlreadyExistsException()
        if await self.users.username_exists(payload.username):
            raise UsernameAlreadyExistsException()

        # Strength was validated at the schema layer; validate again as a
        # non-HTTP-caller safety net before we hash.
        self.passwords.validate(payload.password)

        user = User(
            first_name=payload.first_name,
            last_name=payload.last_name,
            username=payload.username,
            email=payload.email,
            phone_number=payload.phone_number,
            password_hash=self.passwords.hash(payload.password),
            role=UserRole.USER,
            provider=AuthProvider.LOCAL,
            is_active=True,
            is_verified=False,
        )
        user = await self.users.add(user)

        # Fire off (placeholder) onboarding emails.
        verification_token = await self.tokens.create_verification_token(
            user, VerificationTokenType.EMAIL_VERIFICATION
        )
        await self.emails.send_verification_email(
            email=user.email, token=verification_token
        )
        await self.emails.send_welcome_email(
            email=user.email, first_name=user.first_name
        )

        tokens = await self.tokens.issue_pair(user)
        logger.info("New user registered | id=%s email=%s", user.id, user.email)
        return user, tokens

    # ─── Login ────────────────────────────────────────────────────────────────

    async def login(self, payload: LoginRequest) -> Tuple[User, TokenPair]:
        """
        Authenticate by email + password and issue a token pair.

        Unverified users ARE allowed to log in (so they can call
        resend-verification); verification is enforced per-route via the
        ``get_verified_user`` dependency. Inactive users are rejected outright.
        """
        user = await self._authenticate(payload.email, payload.password)

        user.last_login = utcnow()
        await self.users.save(user)

        tokens = await self.tokens.issue_pair(user)
        logger.info("User logged in | id=%s", user.id)
        return user, tokens

    async def _authenticate(self, email: str, password: str) -> User:
        user = await self.users.get_by_email(email)

        # Same generic error whether the email is unknown or the password is
        # wrong — no account enumeration. We still run a verify against a dummy
        # hash to keep the timing roughly constant.
        if user is None or not user.password_hash:
            self.passwords.verify(password, _DUMMY_HASH)
            raise InvalidCredentialsException()

        if not self.passwords.verify(password, user.password_hash):
            raise InvalidCredentialsException()

        if not user.is_active:
            raise InactiveUserException()

        # Opportunistic hash upgrade if the work factor changed.
        if self.passwords.needs_rehash(user.password_hash):
            user.password_hash = self.passwords.hash(password)
            await self.users.save(user)

        return user

    # ─── Token refresh ────────────────────────────────────────────────────────

    async def refresh(self, raw_refresh_token: str) -> Tuple[User, TokenPair]:
        """Rotate a refresh token: revoke it and issue a fresh pair."""
        user_id = await self.tokens.validate_and_revoke_refresh(raw_refresh_token)

        user = await self.users.get_by_id(user_id)
        if user is None or not user.is_active:
            raise InvalidTokenException("Account is no longer available.")

        tokens = await self.tokens.issue_pair(user)
        return user, tokens

    # ─── Logout ───────────────────────────────────────────────────────────────

    async def logout(self, raw_refresh_token: str) -> None:
        """Revoke the presented refresh token. Idempotent."""
        await self.tokens.revoke_refresh_token(raw_refresh_token)

    # ─── Password reset ───────────────────────────────────────────────────────

    async def forgot_password(self, email: str) -> None:
        """
        Begin the reset flow. Always succeeds from the caller's perspective —
        we never reveal whether the email is registered.
        """
        user = await self.users.get_by_email(email)
        if user is None or not user.is_active:
            logger.info("Password reset requested for unknown/inactive email")
            return

        token = await self.tokens.create_verification_token(
            user, VerificationTokenType.PASSWORD_RESET
        )
        await self.emails.send_reset_password_email(email=user.email, token=token)

    async def reset_password(self, token: str, new_password: str) -> None:
        """Complete the reset flow and revoke all sessions."""
        self.passwords.validate(new_password)

        user_id = await self.tokens.consume_verification_token(
            token, VerificationTokenType.PASSWORD_RESET
        )
        user = await self.users.get_by_id(user_id)
        if user is None:
            raise InvalidTokenException("This link is invalid or has expired.")

        user.password_hash = self.passwords.hash(new_password)
        await self.users.save(user)

        # Security: a password change invalidates every existing session.
        await self.tokens.revoke_all_for_user(user.id)
        logger.info("Password reset completed | id=%s", user.id)

    async def change_password(
        self, user: User, current_password: str, new_password: str
    ) -> None:
        """Change the password of an authenticated user."""
        if not self.passwords.verify(current_password, user.password_hash or ""):
            raise InvalidCredentialsException("Current password is incorrect.")

        self.passwords.validate(new_password)
        user.password_hash = self.passwords.hash(new_password)
        await self.users.save(user)

        await self.tokens.revoke_all_for_user(user.id)
        logger.info("Password changed | id=%s", user.id)

    # ─── Email verification ───────────────────────────────────────────────────

    async def verify_email(self, token: str) -> User:
        """Mark the account verified by consuming a verification token."""
        user_id = await self.tokens.consume_verification_token(
            token, VerificationTokenType.EMAIL_VERIFICATION
        )
        user = await self.users.get_by_id(user_id)
        if user is None:
            raise InvalidTokenException("This link is invalid or has expired.")

        if not user.is_verified:
            user.is_verified = True
            await self.users.save(user)
            logger.info("Email verified | id=%s", user.id)
        return user

    async def resend_verification(self, email: str) -> None:
        """
        Re-issue a verification email. Silent about account existence and a
        no-op for already-verified accounts.
        """
        user = await self.users.get_by_email(email)
        if user is None or user.is_verified or not user.is_active:
            return

        token = await self.tokens.create_verification_token(
            user, VerificationTokenType.EMAIL_VERIFICATION
        )
        await self.emails.send_verification_email(email=user.email, token=token)

    # ─── Lookup (used by auth dependency) ─────────────────────────────────────

    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        return await self.users.get_by_id(user_id)


# A valid bcrypt hash of a random string, computed once at import. Verifying
# against it on the "unknown email" path equalises response time so timing does
# not leak whether an account exists.
_DUMMY_HASH = PasswordService.hash(generate_secure_token())
