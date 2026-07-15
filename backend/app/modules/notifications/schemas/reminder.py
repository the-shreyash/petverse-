from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

from app.modules.notifications.models.enums import ReminderType, ReminderStatus

class ReminderBase(BaseModel):
    pet_id: Optional[str] = None
    type: ReminderType
    title: str
    message: Optional[str] = None
    scheduled_at: datetime
    repeat_interval: Optional[int] = None

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    repeat_interval: Optional[int] = None
    status: Optional[ReminderStatus] = None

class ReminderResponse(ReminderBase):
    id: str
    user_id: str
    status: ReminderStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
