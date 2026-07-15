"""
app/modules/health/schemas/medication.py
"""

from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from app.core.schema import PetVerseBaseModel


class MedicationBase(PetVerseBaseModel):
    medicine_name: str = Field(..., max_length=255)
    dosage: str = Field(..., max_length=100)
    frequency: str = Field(..., max_length=100)
    duration: Optional[str] = Field(None, max_length=100)
    instructions: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    status: str = Field("active", max_length=50)


class MedicationCreate(MedicationBase):
    pass


class MedicationUpdate(PetVerseBaseModel):
    medicine_name: Optional[str] = Field(None, max_length=255)
    dosage: Optional[str] = Field(None, max_length=100)
    frequency: Optional[str] = Field(None, max_length=100)
    duration: Optional[str] = Field(None, max_length=100)
    instructions: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = Field(None, max_length=50)


class MedicationResponse(MedicationBase):
    id: str
    pet_id: str
    created_at: datetime
    updated_at: datetime

