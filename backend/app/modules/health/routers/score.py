"""
app/modules/health/routers/score.py
"""

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.dependencies.pets import get_owned_pet
from app.modules.pet.models.pet import Pet
from app.utils.response import success_response
from app.modules.health.schemas.health_score import HealthScoreResponse
from app.modules.health.services.health_score_service import HealthScoreService
from app.modules.health.dependencies import get_health_score_service

router = APIRouter()

@router.get("", summary="Get health score for a pet")
async def get_health_score(
    pet: Pet = Depends(get_owned_pet),
    service: HealthScoreService = Depends(get_health_score_service),
) -> JSONResponse:
    score = await service.calculate_score(pet.id)
    return success_response(data=score.model_dump(mode="json"), message="Health score retrieved.")
