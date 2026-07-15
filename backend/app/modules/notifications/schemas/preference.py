from pydantic import BaseModel, ConfigDict
from typing import Optional

class NotificationPreferenceBase(BaseModel):
    email_enabled: bool = True
    push_enabled: bool = True
    sms_enabled: bool = False
    whatsapp_enabled: bool = False
    
    ai_alerts_enabled: bool = True
    health_alerts_enabled: bool = True
    community_alerts_enabled: bool = True
    orders_alerts_enabled: bool = True
    appointments_alerts_enabled: bool = True

class NotificationPreferenceUpdate(BaseModel):
    email_enabled: Optional[bool] = None
    push_enabled: Optional[bool] = None
    sms_enabled: Optional[bool] = None
    whatsapp_enabled: Optional[bool] = None
    
    ai_alerts_enabled: Optional[bool] = None
    health_alerts_enabled: Optional[bool] = None
    community_alerts_enabled: Optional[bool] = None
    orders_alerts_enabled: Optional[bool] = None
    appointments_alerts_enabled: Optional[bool] = None

class NotificationPreferenceResponse(NotificationPreferenceBase):
    user_id: str

    model_config = ConfigDict(from_attributes=True)
