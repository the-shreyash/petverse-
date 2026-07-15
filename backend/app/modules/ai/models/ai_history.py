"""
app/modules/ai/models/ai_history.py

Models for storing AI conversations and individual messages.
"""

from __future__ import annotations
from typing import Optional

from sqlalchemy import ForeignKey, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class AIConversation(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Represents a chat session with the AI engine."""
    __tablename__ = "ai_conversations"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    pet_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("pets.id", ondelete="SET NULL"), index=True, nullable=True)
    title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    context_snapshot: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    messages: Mapped[list["AIMessage"]] = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan", lazy="selectin")

    def __repr__(self) -> str:
        return f"<AIConversation id={self.id} user_id={self.user_id}>"


class AIMessage(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Represents a single message in an AI conversation."""
    __tablename__ = "ai_messages"

    conversation_id: Mapped[str] = mapped_column(String(36), ForeignKey("ai_conversations.id", ondelete="CASCADE"), index=True, nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False) # 'user', 'assistant', 'system'
    content: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Optional metadata (e.g., token usage for this specific message, or reason finish)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    conversation: Mapped["AIConversation"] = relationship("AIConversation", back_populates="messages")

    def __repr__(self) -> str:
        return f"<AIMessage id={self.id} role={self.role}>"
