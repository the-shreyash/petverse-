"""
app/modules/health/routers/weight.py
"""

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.dependencies.pets import get_owned_pet
from app.modules.pet.models.pet import Pet
from app.utils.response import success_response, created_response
from app.modules.health.schemas.weight import WeightHistoryCreate, WeightHistoryResponse
from app.modules.health.services.weight_service import WeightService
from app.modules.health.dependencies import get_weight_service

router = APIRouter()

@router.post("", summary="Create a weight record", status_code=201)
async def create_weight(
    payload: WeightHistoryCreate,
    pet: Pet = Depends(get_owned_pet),
    service: WeightService = Depends(get_weight_service),
) -> JSONResponse:
    weight = await service.create_weight_history(pet.id, payload)
    return created_response(data=WeightHistoryResponse.model_validate(weight).model_dump(mode="json"), message="Weight record created.")

@router.get("", summary="List weight records for a pet")
async def list_weights(
    pet: Pet = Depends(get_owned_pet),
    service: WeightService = Depends(get_weight_service),
) -> JSONResponse:
    weights = await service.list_weight_histories(pet.id)
    data = [WeightHistoryResponse.model_validate(r).model_dump(mode="json") for r in weights]
    return success_response(data=data, message="Weight records retrieved.")

@router.delete("/{weight_id}", summary="Delete a weight record")
async def delete_weight(
    weight_id: str,
    pet: Pet = Depends(get_owned_pet),
    service: WeightService = Depends(get_weight_service),
) -> JSONResponse:
    await service.delete_weight_history(weight_id)
    return success_response(data=None, message="Weight record deleted.")
