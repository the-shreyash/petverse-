"""
app/models/verification_token.py

Single-use tokens for email verification and password reset.

Both flows share the same mechanics — issue an opaque random token, email it,
verify it once, then burn it — so they share one table discriminated by
``token_type``.

As with refresh tokens we persist only the SHA-256 hash of the opaque token.
The raw token exists only in the email link; the database never sees it.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.models.enums import VerificationTokenType
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class VerificationToken(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """An email-verification or password-reset token."""

    __tablename__ = "verification_tokens"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    token_hash: Mapped[str] = mapped_column(
        String(64), unique=True, index=True, nullable=False
    )

    token_type: Mapped[VerificationTokenType] = mapped_column(
        Enum(VerificationTokenType, native_enum=False, length=32),
        nullable=False,
        index=True,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    # Timestamp the token was consumed. NULL means "still usable".
    used_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return (
            f"<VerificationToken user_id={self.user_id} "
            f"type={self.token_type} used={self.used_at is not None}>"
        )
