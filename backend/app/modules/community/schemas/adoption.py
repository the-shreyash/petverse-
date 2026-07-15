from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

from app.modules.community.models.enums import AdoptionStatus

class AdoptionListingBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: str
    pet_id: str
    status: AdoptionStatus = AdoptionStatus.AVAILABLE
    adoption_fee: Optional[float] = Field(None, ge=0)
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    gallery: List[str] = []

class AdoptionListingCreate(AdoptionListingBase):
    pass

class AdoptionListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[AdoptionStatus] = None
    adoption_fee: Optional[float] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    gallery: Optional[List[str]] = None

class AdoptionListingResponse(AdoptionListingBase):
    id: str
    owner_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
