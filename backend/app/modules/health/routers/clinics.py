from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from typing import List, Optional
from app.utils.response import success_response
from app.modules.health.providers.google_places_provider import GooglePlacesProvider
from app.modules.health.providers.osm_provider import OSMProvider
from app.modules.health.providers.vet_provider import ClinicSearchResult

router = APIRouter()

@router.get("/search", summary="Search for veterinary clinics")
async def search_clinics(
    q: str = Query("vet clinic"),
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius: int = Query(5000, description="Radius in meters"),
    provider: str = Query("google", description="Provider to use: 'google' or 'osm'")
) -> JSONResponse:
    
    if provider == "google":
        # In production, pass real API key from settings
        vet_provider = GooglePlacesProvider(api_key="MOCK_API_KEY")
    else:
        vet_provider = OSMProvider()
        
    results = await vet_provider.search_clinics(query=q, lat=lat, lng=lng, radius=radius)
    
    # Return as dict using model_dump
    data = [r.model_dump(mode="json") for r in results]
    
    return success_response(data=data, message="Clinics retrieved successfully.")
