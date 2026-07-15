"""
app/modules/health/schemas/document.py
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from app.core.schema import PetVerseBaseModel


class HealthDocumentBase(PetVerseBaseModel):
    title: str = Field(..., max_length=255)
    category: str = Field(..., max_length=100)
    file_url: str = Field(..., max_length=1024)


class HealthDocumentCreate(HealthDocumentBase):
    pass


class HealthDocumentResponse(HealthDocumentBase):
    id: str
    pet_id: str
    uploaded_at: datetime
    created_at: datetime
    updated_at: datetime

