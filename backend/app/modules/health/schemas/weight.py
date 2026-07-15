"""
app/modules/health/schemas/weight.py
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from app.core.schema import PetVerseBaseModel


class WeightHistoryBase(PetVerseBaseModel):
    weight: float = Field(..., gt=0)
    height: Optional[float] = Field(None, gt=0)
    recorded_at: Optional[datetime] = None
    notes: Optional[str] = None


class WeightHistoryCreate(WeightHistoryBase):
    pass


class WeightHistoryResponse(WeightHistoryBase):
    id: str
    pet_id: str
    recorded_at: datetime
    created_at: datetime
    updated_at: datetime

