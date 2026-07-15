"""
app/modules/community/models/comment.py
"""
from typing import Optional
from sqlalchemy import String, Text, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin

class Comment(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "community_comments"

    post_id: Mapped[str] = mapped_column(String(36), ForeignKey("community_posts.id", ondelete="CASCADE"), index=True, nullable=False)
    author_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    parent_comment_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("community_comments.id", ondelete="CASCADE"), index=True, nullable=True)
    
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    post: Mapped["Post"] = relationship("Post", back_populates="comments")
    replies: Mapped[list["Comment"]] = relationship("Comment", back_populates="parent")
    parent: Mapped[Optional["Comment"]] = relationship("Comment", back_populates="replies", remote_side="Comment.id")
