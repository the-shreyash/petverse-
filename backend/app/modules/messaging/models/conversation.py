"""
app/modules/messaging/models/conversation.py

Private 1:1 conversations. Modelled with an explicit participant table rather
than sender/recipient columns on the conversation so group threads can be added
later without a migration of existing rows.
"""
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Text, ForeignKey, Boolean, DateTime, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Conversation(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "conversations"

    # Optional context: a conversation started from an adoption listing or pet.
    listing_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True, index=True)
    pet_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("pets.id", ondelete="SET NULL"), nullable=True, index=True)

    last_message_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), index=True, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    participants: Mapped[list["ConversationParticipant"]] = relationship(
        "ConversationParticipant", back_populates="conversation", cascade="all, delete-orphan"
    )
    messages: Mapped[list["Message"]] = relationship(
        "Message", back_populates="conversation", cascade="all, delete-orphan"
    )


class ConversationParticipant(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "conversation_participants"
    __table_args__ = (UniqueConstraint("conversation_id", "user_id", name="uq_conversation_participant"),)

    conversation_id: Mapped[str] = mapped_column(String(36), ForeignKey("conversations.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    # Unread counts are derived from this rather than a counter column, so they
    # stay correct even if messages are inserted out of band.
    last_read_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="participants")
    user = relationship("User", foreign_keys=[user_id])


class Message(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "messages"

    conversation_id: Mapped[str] = mapped_column(String(36), ForeignKey("conversations.id", ondelete="CASCADE"), index=True, nullable=False)
    sender_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    media_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="messages")
    sender = relationship("User", foreign_keys=[sender_id])
