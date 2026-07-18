from typing import List, Optional
from .vet_provider import VetProvider, ClinicSearchResult

class GooglePlacesProvider(VetProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def search_clinics(self, query: str, lat: float, lng: float, radius: int = 5000) -> List[ClinicSearchResult]:
        # TODO: Implement real HTTP call to Google Places API
        return [
            ClinicSearchResult(
                provider="google",
                provider_id="g_123",
                name="Google Mock Vet Clinic",
                address="123 Google Way",
                latitude=lat + 0.01,
                longitude=lng + 0.01,
                phone="555-0101",
                rating=4.8
            )
        ]

    async def get_clinic_details(self, provider_id: str) -> Optional[ClinicSearchResult]:
        return None
