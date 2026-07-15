from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

from app.modules.community.models.enums import LostPetStatus

class LostPetBase(BaseModel):
    pet_id: str
    last_seen_location: str
    last_seen_date: datetime
    reward: Optional[float] = Field(None, ge=0)
    contact_number: Optional[str] = None
    status: LostPetStatus = LostPetStatus.LOST

class LostPetCreate(LostPetBase):
    pass

class LostPetUpdate(BaseModel):
    last_seen_location: Optional[str] = None
    last_seen_date: Optional[datetime] = None
    reward: Optional[float] = None
    contact_number: Optional[str] = None
    status: Optional[LostPetStatus] = None

class LostPetResponse(LostPetBase):
    id: str
    owner_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
