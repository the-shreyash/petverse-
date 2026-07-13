"""
app/models/refresh_token.py

Persistent record of issued refresh tokens.

Why store refresh tokens server-side when JWTs are stateless?
  - **Logout must be real.** A purely stateless refresh token cannot be
    invalidated before it expires. By persisting a row per token we can revoke
    it on logout (or on a security event) so it can never mint new access
    tokens again.
  - **Rotation & theft detection.** Each refresh issues a new token and revokes
    the old one. If a revoked token is replayed we know it was leaked.

What we store is the SHA-256 *hash* of the token, never the token itself — the
same principle as password hashing. A database leak therefore does not hand an
attacker usable tokens.
"""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class RefreshToken(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A single issued refresh token belonging to a user."""

    __tablename__ = "refresh_tokens"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    # SHA-256 hex digest of the raw token (64 chars). Unique so a lookup by
    # hash is O(1) and a token can never be double-registered.
    token_hash: Mapped[str] = mapped_column(
        String(64), unique=True, index=True, nullable=False
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    revoked: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False,
        doc="Set True on logout or rotation. Revoked tokens are rejected.",
    )

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"<RefreshToken user_id={self.user_id} revoked={self.revoked}>"
