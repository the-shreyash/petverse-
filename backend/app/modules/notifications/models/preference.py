from sqlalchemy import String, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin

class NotificationPreference(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "notification_preferences"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    
    # Channels
    email_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    push_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sms_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    whatsapp_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    # Categories
    ai_alerts_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    health_alerts_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    community_alerts_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    orders_alerts_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    appointments_alerts_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
