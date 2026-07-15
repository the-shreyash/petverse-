"""
app/models/user_privacy.py

The ``UserPrivacySetting`` ORM model — one row per user, controlling who can
see the profile and whether it surfaces in search/discovery.

Kept as its own table for the same reason as ``UserPreference``: a distinct
concern (visibility/discovery) with its own lifecycle, consulted by future
modules (Community, Shop, Search) without them needing to know anything else
about the user.
"""

from __future__ import annotations

from sqlalchemy import Boolean, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.models.enums import ProfileVisibility
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class UserPrivacySetting(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Per-user profile visibility and discoverability settings."""

    __tablename__ = "user_privacy_settings"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        index=True,
        nullable=False,
    )

    profile_visibility: Mapped[ProfileVisibility] = mapped_column(
        Enum(ProfileVisibility, native_enum=False, length=16),
        default=ProfileVisibility.PUBLIC,
        nullable=False,
    )
    # Whether the profile can appear in search/discovery surfaces, independent
    # of ``profile_visibility`` (a public profile may still opt out of search).
    search_visibility: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return (
            f"<UserPrivacySetting user_id={self.user_id} "
            f"visibility={self.profile_visibility}>"
        )
