from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy import String, Text, ForeignKey, Enum, JSON, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin
from .enums import NotificationType, NotificationPriority, NotificationStatus

class Notification(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "notifications"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    
    type: Mapped[NotificationType] = mapped_column(Enum(NotificationType, native_enum=False, length=16), nullable=False)
    priority: Mapped[NotificationPriority] = mapped_column(Enum(NotificationPriority, native_enum=False, length=16), default=NotificationPriority.NORMAL, nullable=False)
    status: Mapped[NotificationStatus] = mapped_column(Enum(NotificationStatus, native_enum=False, length=16), default=NotificationStatus.UNREAD, index=True, nullable=False)
    
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    
    entity_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True) # E.g., 'Post', 'Vaccination'
    entity_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    
    # Store any extra data for deep linking or context
    meta_data: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
