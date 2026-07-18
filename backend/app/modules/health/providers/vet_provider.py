from abc import ABC, abstractmethod
from typing import List, Optional
from pydantic import BaseModel

class ClinicSearchResult(BaseModel):
    provider: str
    provider_id: str
    name: str
    address: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    phone: Optional[str]
    rating: Optional[float]

class VetProvider(ABC):
    @abstractmethod
    async def search_clinics(self, query: str, lat: float, lng: float, radius: int = 5000) -> List[ClinicSearchResult]:
        pass

    @abstractmethod
    async def get_clinic_details(self, provider_id: str) -> Optional[ClinicSearchResult]:
        pass
