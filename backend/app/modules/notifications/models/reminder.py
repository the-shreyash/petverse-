from datetime import datetime
from typing import Optional
from sqlalchemy import String, ForeignKey, Enum, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin
from .enums import ReminderType, ReminderStatus

class Reminder(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "reminders"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    pet_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("pets.id", ondelete="CASCADE"), index=True, nullable=True)
    
    type: Mapped[ReminderType] = mapped_column(Enum(ReminderType, native_enum=False, length=16), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    repeat_interval: Mapped[Optional[int]] = mapped_column(Integer, nullable=True) # In days, None if one-off
    
    status: Mapped[ReminderStatus] = mapped_column(Enum(ReminderStatus, native_enum=False, length=16), default=ReminderStatus.ACTIVE, nullable=False)
