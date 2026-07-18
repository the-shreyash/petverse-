from typing import List, Optional
from .vet_provider import VetProvider, ClinicSearchResult

class OSMProvider(VetProvider):
    async def search_clinics(self, query: str, lat: float, lng: float, radius: int = 5000) -> List[ClinicSearchResult]:
        # TODO: Implement real HTTP call to OpenStreetMap Overpass API
        return [
            ClinicSearchResult(
                provider="osm",
                provider_id="osm_123",
                name="OSM Mock Vet Clinic",
                address="456 OSM St",
                latitude=lat - 0.01,
                longitude=lng - 0.01,
                phone="555-0202",
                rating=None
            )
        ]

    async def get_clinic_details(self, provider_id: str) -> Optional[ClinicSearchResult]:
        return None
