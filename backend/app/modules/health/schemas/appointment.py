from datetime import datetime
from typing import Optional, List
from pydantic import Field
from app.core.schema import PetVerseBaseModel
from .clinic import ClinicResponse

class AppointmentCreate(PetVerseBaseModel):
    clinic_id: Optional[str] = None
    visit_date: datetime
    reason: Optional[str] = None
    notes: Optional[str] = None
    clinic_name: Optional[str] = None
    veterinarian: Optional[str] = None

class AppointmentUpdate(PetVerseBaseModel):
    clinic_id: Optional[str] = None
    status: Optional[str] = None
    visit_date: Optional[datetime] = None
    reason: Optional[str] = None
    notes: Optional[str] = None
    clinic_name: Optional[str] = None
    veterinarian: Optional[str] = None

class AppointmentResponse(PetVerseBaseModel):
    id: str
    pet_id: str
    clinic_id: Optional[str] = None
    status: str
    visit_date: datetime
    reason: Optional[str] = None
    notes: Optional[str] = None
    clinic_name: Optional[str] = None
    veterinarian: Optional[str] = None
    clinic: Optional[ClinicResponse] = None
