"""
app/modules/health/routers/timeline.py
"""

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.dependencies.pets import get_owned_pet
from app.modules.pet.models.pet import Pet
from app.utils.response import success_response
from app.modules.health.schemas.timeline import TimelineResponse
from app.modules.health.services.timeline_service import TimelineService
from app.modules.health.dependencies import get_timeline_service

router = APIRouter()

@router.get("", summary="Get health timeline for a pet")
async def get_timeline(
    pet: Pet = Depends(get_owned_pet),
    service: TimelineService = Depends(get_timeline_service),
) -> JSONResponse:
    timeline = await service.generate_timeline(pet.id)
    return success_response(data=timeline.model_dump(mode="json"), message="Timeline retrieved.")
