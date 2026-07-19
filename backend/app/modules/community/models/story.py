"""
app/modules/community/models/story.py
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, ForeignKey, Boolean, DateTime, Enum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin
from .enums import StoryMediaType


class Story(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "community_stories"

    author_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    pet_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("pets.id", ondelete="SET NULL"), index=True, nullable=True)

    media_url: Mapped[str] = mapped_column(String(500), nullable=False)
    media_type: Mapped[StoryMediaType] = mapped_column(Enum(StoryMediaType, native_enum=False, length=16), default=StoryMediaType.IMAGE, nullable=False)
    caption: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Stories are ephemeral: the feed filters on this rather than deleting rows,
    # so view history survives expiry. UTC, matching TimestampMixin.
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)

    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    author = relationship("User", foreign_keys=[author_id])
    views: Mapped[list["StoryView"]] = relationship("StoryView", back_populates="story", cascade="all, delete-orphan")


class StoryView(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "community_story_views"
    __table_args__ = (UniqueConstraint("story_id", "viewer_id", name="uq_story_view"),)

    story_id: Mapped[str] = mapped_column(String(36), ForeignKey("community_stories.id", ondelete="CASCADE"), index=True, nullable=False)
    viewer_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    story: Mapped["Story"] = relationship("Story", back_populates="views")
    viewer = relationship("User", foreign_keys=[viewer_id])
