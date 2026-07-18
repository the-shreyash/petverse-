from typing import Optional, Any
from pydantic import Field
from app.core.schema import PetVerseBaseModel

class ClinicCreate(PetVerseBaseModel):
    name: str
    provider: str = "internal"
    provider_id: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    zip_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    is_verified: bool = False
    metadata_blob: Optional[dict[str, Any]] = None

class ClinicResponse(PetVerseBaseModel):
    id: str
    name: str
    provider: str
    provider_id: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    zip_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    is_verified: bool
    metadata_blob: Optional[dict[str, Any]] = None
