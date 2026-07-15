"""
app/schemas/pet.py

Pet-facing serialisation schemas (Phase B4 — Pet Management).

``PetResponse`` is the ONLY shape in which a pet is ever returned to clients.
``age`` is computed on the fly from ``birth_date`` rather than stored — see
the design note in ``app/models/pet.py``.
"""

from __future__ import annotations

import re
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator
from app.core.schema import PetVerseBaseModel

from app.database.enums import PetGender, PetSpecies, PetStatus

_MICROCHIP_PATTERN = re.compile(r"^[A-Za-z0-9]{9,50}$")


def _compute_age(birth_date: Optional[date]) -> Optional[str]:
    """
    Human-readable age string (e.g. "2 years", "5 months") derived from
    ``birth_date``. Returns ``None`` when the birth date is unknown.
    """
    if birth_date is None:
        return None

    today = date.today()
    years = today.year - birth_date.year
    months = today.month - birth_date.month
    if today.day < birth_date.day:
        months -= 1
    if months < 0:
        years -= 1
        months += 12

    if years <= 0:
        return f"{max(months, 0)} month{'s' if months != 1 else ''}"
    if months == 0:
        return f"{years} year{'s' if years != 1 else ''}"
    return f"{years} year{'s' if years != 1 else ''} {months} month{'s' if months != 1 else ''}"


# ─── Shared field validation (create / replace / update) ──────────────────────

class _PetFieldValidators:
    """Mixin of field validators shared by every pet write schema."""

    @field_validator("name")
    @classmethod
    def _strip_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name must not be blank.")
        return v

    @field_validator("breed", "color")
    @classmethod
    def _strip_optional_text(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if v else v

    @field_validator("birth_date")
    @classmethod
    def _birth_date_not_future(cls, v: Optional[date]) -> Optional[date]:
        if v is not None and v > date.today():
            raise ValueError("Birth date cannot be in the future.")
        return v

    @field_validator("microchip_number")
    @classmethod
    def _validate_microchip(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v = v.strip().upper()
        if not v:
            return None
        if not _MICROCHIP_PATTERN.match(v):
            raise ValueError(
                "Microchip number must be 9-50 alphanumeric characters."
            )
        return v


# ─── Create (POST /pets) ───────────────────────────────────────────────────────

class PetCreateRequest(_PetFieldValidators, PetVerseBaseModel):
    """Payload for ``POST /pets``."""

    name: str = Field(..., min_length=1, max_length=100)
    species: PetSpecies
    breed: Optional[str] = Field(default=None, max_length=100)
    gender: Optional[PetGender] = None
    birth_date: Optional[date] = None
    weight: Optional[float] = Field(default=None, gt=0, le=9999.99)
    height: Optional[float] = Field(default=None, gt=0, le=9999.99)
    color: Optional[str] = Field(default=None, max_length=100)
    microchip_number: Optional[str] = Field(default=None, max_length=50)
    sterilized: bool = False
    blood_group: Optional[str] = Field(default=None, max_length=20)
    description: Optional[str] = Field(default=None, max_length=2000)


# ─── Replace (PUT /pets/{id}) ──────────────────────────────────────────────────

class PetReplaceRequest(_PetFieldValidators, PetVerseBaseModel):
    """Payload for ``PUT /pets/{pet_id}`` — replaces every editable field."""

    name: str = Field(..., min_length=1, max_length=100)
    species: PetSpecies
    breed: Optional[str] = Field(default=None, max_length=100)
    gender: Optional[PetGender] = None
    birth_date: Optional[date] = None
    weight: Optional[float] = Field(default=None, gt=0, le=9999.99)
    height: Optional[float] = Field(default=None, gt=0, le=9999.99)
    color: Optional[str] = Field(default=None, max_length=100)
    microchip_number: Optional[str] = Field(default=None, max_length=50)
    sterilized: bool = False
    blood_group: Optional[str] = Field(default=None, max_length=20)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: PetStatus = PetStatus.ACTIVE
    is_active: bool = True


# ─── Update (PATCH /pets/{id}) ─────────────────────────────────────────────────

class PetUpdateRequest(_PetFieldValidators, PetVerseBaseModel):
    """Payload for ``PATCH /pets/{pet_id}`` — only provided fields are updated."""

    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    species: Optional[PetSpecies] = None
    breed: Optional[str] = Field(default=None, max_length=100)
    gender: Optional[PetGender] = None
    birth_date: Optional[date] = None
    weight: Optional[float] = Field(default=None, gt=0, le=9999.99)
    height: Optional[float] = Field(default=None, gt=0, le=9999.99)
    color: Optional[str] = Field(default=None, max_length=100)
    microchip_number: Optional[str] = Field(default=None, max_length=50)
    sterilized: Optional[bool] = None
    blood_group: Optional[str] = Field(default=None, max_length=20)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: Optional[PetStatus] = None
    is_active: Optional[bool] = None


# ─── Response ───────────────────────────────────────────────────────────────────

class PetResponse(PetVerseBaseModel):
    """Public representation of a pet."""


    id: str
    owner_id: str
    name: str
    species: PetSpecies
    breed: Optional[str] = None
    gender: Optional[PetGender] = None
    birth_date: Optional[date] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    color: Optional[str] = None
    microchip_number: Optional[str] = None
    sterilized: bool
    blood_group: Optional[str] = None
    profile_image: Optional[str] = None
    cover_image: Optional[str] = None
    description: Optional[str] = None
    status: PetStatus
    is_active: bool
    created_at: datetime
    updated_at: datetime

    age: Optional[str] = None

    @model_validator(mode="after")
    def _fill_age(self) -> "PetResponse":
        self.age = _compute_age(self.birth_date)
        return self


# ─── Images ─────────────────────────────────────────────────────────────────────

class PetProfileImageResponse(PetVerseBaseModel):

    profile_image: Optional[str] = None


class PetCoverImageResponse(PetVerseBaseModel):

    cover_image: Optional[str] = None


class PetGalleryImageResponse(PetVerseBaseModel):

    id: str
    pet_id: str
    image_url: str
    position: int
    created_at: datetime
