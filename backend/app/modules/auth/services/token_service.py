"""
app/services/token_service.py

Issues, validates, and rotates authentication tokens.

Responsibilities:
  - Mint short-lived JWT **access** tokens (stateless; carry id/email/role).
  - Mint long-lived JWT **refresh** tokens AND persist a hashed record so they
    can be revoked (logout) and rotated (each refresh burns the old one).
  - Generate opaque single-use tokens for email verification / password reset.

Why access = JWT but the refresh token is also backed by a DB row:
  Access tokens are verified purely from their signature (fast, no DB hit) and
  are short-lived, so the damage window if one leaks is small. Refresh tokens
  live for days, so they must be individually revocable — hence the stored hash.
"""

from __future__ import annotations

from datetime import timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.exceptions.auth import ExpiredTokenException, InvalidTokenException
from app.database.enums import VerificationTokenType
from app.modules.user.models.user import User
from app.modules.auth.repositories.token_repository import (
    RefreshTokenRepository,
    VerificationTokenRepository,
)
from app.modules.auth.schemas.auth import TokenPair
from app.utils import jwt_helper
from app.utils.datetime_helper import utcnow
from app.utils.jwt_helper import (
    ACCESS_TOKEN_TYPE,
    REFRESH_TOKEN_TYPE,
    TokenDecodeError,
)
from app.utils.security import generate_secure_token, hash_token


class TokenService:
    """Create and verify access / refresh / verification tokens."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.settings = get_settings()
        self.refresh_repo = RefreshTokenRepository(session)
        self.verification_repo = VerificationTokenRepository(session)

    # ─── Access tokens ────────────────────────────────────────────────────────

    def create_access_token(self, user: User) -> tuple[str, int]:
        """Return ``(token, expires_in_seconds)`` for a user."""
        expires = timedelta(minutes=self.settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token, _jti, _exp = jwt_helper.create_token(
            subject=user.id,
            token_type=ACCESS_TOKEN_TYPE,
            expires_delta=expires,
            extra_claims={"email": user.email, "role": user.role.value},
        )
        return token, int(expires.total_seconds())

    # ─── Refresh tokens ───────────────────────────────────────────────────────

    async def create_refresh_token(self, user: User) -> str:
        """Mint a refresh token and persist its hash for later revocation."""
        expires = timedelta(days=self.settings.REFRESH_TOKEN_EXPIRE_DAYS)
        token, _jti, expires_at = jwt_helper.create_token(
            subject=user.id,
            token_type=REFRESH_TOKEN_TYPE,
            expires_delta=expires,
        )
        await self.refresh_repo.create(
            user_id=user.id,
            token_hash=hash_token(token),
            expires_at=expires_at,
        )
        return token

    async def issue_pair(self, user: User) -> TokenPair:
        """Create a fresh access + refresh pair (used on login/register)."""
        access, expires_in = self.create_access_token(user)
        refresh = await self.create_refresh_token(user)
        return TokenPair(
            access_token=access,
            refresh_token=refresh,
            expires_in=expires_in,
        )

    async def validate_and_revoke_refresh(self, raw_refresh_token: str) -> str:
        """
        Validate a refresh token (signature, type, expiry, DB record, not
        revoked) and revoke it as part of rotation. Returns the owning
        ``user_id`` so the caller can load the user and mint a new pair.

        Raises the appropriate auth exception if the token is expired, the wrong
        type, unknown, or already revoked.
        """
        payload = self._decode(raw_refresh_token, expected_type=REFRESH_TOKEN_TYPE)

        stored = await self.refresh_repo.get_by_hash(hash_token(raw_refresh_token))
        if stored is None or stored.revoked:
            # Unknown or already-used token — treat as compromised, reject.
            raise InvalidTokenException("Refresh token is no longer valid.")

        # Rotation: the presented token can never be used again.
        await self.refresh_repo.revoke(stored)
        return payload["sub"]

    async def revoke_refresh_token(self, raw_refresh_token: str) -> None:
        """Revoke a single refresh token (logout). Idempotent — silent if unknown."""
        stored = await self.refresh_repo.get_by_hash(hash_token(raw_refresh_token))
        if stored is not None and not stored.revoked:
            await self.refresh_repo.revoke(stored)

    async def revoke_all_for_user(self, user_id: str) -> None:
        """Revoke every refresh token for a user (password change / reset)."""
        await self.refresh_repo.revoke_all_for_user(user_id)

    # ─── Opaque verification / reset tokens ───────────────────────────────────

    async def create_verification_token(
        self, user: User, token_type: VerificationTokenType
    ) -> str:
        """
        Issue a single-use opaque token, invalidating any previous outstanding
        token of the same type. Returns the RAW token (goes in the email link).
        """
        await self.verification_repo.invalidate_outstanding(user.id, token_type)

        if token_type == VerificationTokenType.EMAIL_VERIFICATION:
            ttl = timedelta(hours=self.settings.EMAIL_VERIFICATION_EXPIRE_HOURS)
        else:
            ttl = timedelta(minutes=self.settings.PASSWORD_RESET_EXPIRE_MINUTES)

        raw = generate_secure_token()
        await self.verification_repo.create(
            user_id=user.id,
            token_hash=hash_token(raw),
            token_type=token_type,
            expires_at=utcnow() + ttl,
        )
        return raw

    async def consume_verification_token(
        self, raw_token: str, token_type: VerificationTokenType
    ) -> str:
        """
        Validate and burn a verification token. Returns the ``user_id`` it
        belonged to. Raises ``InvalidTokenException`` if missing/expired/used.
        """
        stored = await self.verification_repo.get_active(
            hash_token(raw_token), token_type
        )
        if stored is None:
            raise InvalidTokenException("This link is invalid or has expired.")
        await self.verification_repo.mark_used(stored)
        return stored.user_id

    # ─── Internal ─────────────────────────────────────────────────────────────

    def _decode(self, token: str, *, expected_type: str) -> dict:
        try:
            payload = jwt_helper.decode_token(token)
        except TokenDecodeError as exc:
            if exc.expired:
                raise ExpiredTokenException() from exc
            raise InvalidTokenException() from exc

        if payload.get("type") != expected_type:
            raise InvalidTokenException(
                f"Expected a {expected_type} token."
            )
        if not payload.get("sub"):
            raise InvalidTokenException("Token is missing its subject.")
        return payload

    def decode_access_token(self, token: str) -> dict:
        """Public helper used by the auth dependency to validate access tokens."""
        return self._decode(token, expected_type=ACCESS_TOKEN_TYPE)
