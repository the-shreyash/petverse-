"""
app/modules/health/schemas/vaccination.py
"""

from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from app.core.schema import PetVerseBaseModel


class VaccinationBase(PetVerseBaseModel):
    vaccine_name: str = Field(..., max_length=255)
    manufacturer: Optional[str] = Field(None, max_length=255)
    batch_number: Optional[str] = Field(None, max_length=100)
    dose: Optional[str] = Field(None, max_length=50)
    administration_date: date
    expiry_date: Optional[date] = None
    next_due_date: Optional[date] = None
    status: str = Field("administered", max_length=50)
    certificate_url: Optional[str] = Field(None, max_length=1024)


class VaccinationCreate(VaccinationBase):
    pass


class VaccinationUpdate(PetVerseBaseModel):
    vaccine_name: Optional[str] = Field(None, max_length=255)
    manufacturer: Optional[str] = Field(None, max_length=255)
    batch_number: Optional[str] = Field(None, max_length=100)
    dose: Optional[str] = Field(None, max_length=50)
    administration_date: Optional[date] = None
    expiry_date: Optional[date] = None
    next_due_date: Optional[date] = None
    status: Optional[str] = Field(None, max_length=50)
    certificate_url: Optional[str] = Field(None, max_length=1024)


class VaccinationResponse(VaccinationBase):
    id: str
    pet_id: str
    created_at: datetime
    updated_at: datetime

