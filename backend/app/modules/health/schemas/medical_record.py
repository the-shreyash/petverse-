"""
app/modules/health/schemas/medical_record.py
"""

from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from app.core.schema import PetVerseBaseModel


class MedicalRecordBase(PetVerseBaseModel):
    doctor_id: Optional[str] = None
    visit_date: date
    diagnosis: str = Field(..., max_length=255)
    symptoms: Optional[str] = None
    treatment: Optional[str] = None
    notes: Optional[str] = None
    follow_up_date: Optional[date] = None


class MedicalRecordCreate(MedicalRecordBase):
    pass


class MedicalRecordUpdate(PetVerseBaseModel):
    doctor_id: Optional[str] = None
    visit_date: Optional[date] = None
    diagnosis: Optional[str] = Field(None, max_length=255)
    symptoms: Optional[str] = None
    treatment: Optional[str] = None
    notes: Optional[str] = None
    follow_up_date: Optional[date] = None


class MedicalRecordResponse(MedicalRecordBase):
    id: str
    pet_id: str
    created_at: datetime
    updated_at: datetime

