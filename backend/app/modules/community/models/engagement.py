"""
app/modules/community/models/engagement.py
Contains Like and Bookmark models.
"""
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin

class Like(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "community_likes"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    post_id: Mapped[str] = mapped_column(String(36), ForeignKey("community_posts.id", ondelete="CASCADE"), index=True, nullable=False)

    post: Mapped["Post"] = relationship("Post", back_populates="likes")


class Bookmark(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "community_bookmarks"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    post_id: Mapped[str] = mapped_column(String(36), ForeignKey("community_posts.id", ondelete="CASCADE"), index=True, nullable=False)

    post: Mapped["Post"] = relationship("Post", back_populates="bookmarks")
