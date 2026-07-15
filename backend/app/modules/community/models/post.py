"""
app/modules/community/models/post.py
"""
from datetime import datetime
from typing import Any, Dict, Optional, List
from sqlalchemy import String, Text, ForeignKey, Boolean, DateTime, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin
from .enums import PostVisibility

class Post(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "community_posts"

    author_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    pet_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("pets.id", ondelete="SET NULL"), index=True, nullable=True)
    
    content: Mapped[str] = mapped_column(Text, nullable=False)
    media_urls: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    visibility: Mapped[PostVisibility] = mapped_column(Enum(PostVisibility, native_enum=False, length=16), default=PostVisibility.PUBLIC, nullable=False)
    
    # Simple string for location for now, per user plan
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    comments: Mapped[list["Comment"]] = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    likes: Mapped[list["Like"]] = relationship("Like", back_populates="post", cascade="all, delete-orphan")
    bookmarks: Mapped[list["Bookmark"]] = relationship("Bookmark", back_populates="post", cascade="all, delete-orphan")
