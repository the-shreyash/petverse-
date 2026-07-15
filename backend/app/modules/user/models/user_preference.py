"""
app/models/user_preference.py

The ``UserPreference`` ORM model — one row per user, holding UI theme and
per-channel notification toggles.

Design: a dedicated table (not columns bolted onto ``users``) because these
settings are write-heavy from a single "Preferences" screen and conceptually
distinct from identity data. Kept 1:1 via a unique ``user_id`` so every future
module that fires a notification (Health, Orders, Community, AI) can check a
single, well-known place rather than growing its own opt-out flag.

Reusability: any module that ever needs "should I notify this user about X"
imports this model — never re-implement per-module notification flags.
"""

from __future__ import annotations

from sqlalchemy import Boolean, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.enums import ThemePreference
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class UserPreference(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Per-user UI and notification preferences."""

    __tablename__ = "user_preferences"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        index=True,
        nullable=False,
    )

    # ─── UI ───────────────────────────────────────────────────────────────────
    theme: Mapped[ThemePreference] = mapped_column(
        Enum(ThemePreference, native_enum=False, length=16),
        default=ThemePreference.SYSTEM,
        nullable=False,
    )

    # ─── Notification channels ────────────────────────────────────────────────
    email_notifications: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    push_notifications: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    marketing_emails: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # ─── Notification categories (per future module) ─────────────────────────
    ai_notifications: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    community_notifications: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    order_notifications: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    health_notifications: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"<UserPreference user_id={self.user_id} theme={self.theme}>"
