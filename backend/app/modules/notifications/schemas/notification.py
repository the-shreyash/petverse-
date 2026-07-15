from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime

from app.modules.notifications.models.enums import NotificationType, NotificationPriority, NotificationStatus

class NotificationBase(BaseModel):
    type: NotificationType
    priority: NotificationPriority = NotificationPriority.NORMAL
    title: str
    message: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    meta_data: Dict[str, Any] = {}

class NotificationCreate(NotificationBase):
    user_id: str

class NotificationResponse(NotificationBase):
    id: str
    user_id: str
    status: NotificationStatus
    created_at: datetime
    read_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
