"""
app/modules/health/routers/vaccinations.py
"""

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.dependencies.pets import get_owned_pet
from app.modules.pet.models.pet import Pet
from app.utils.response import success_response, created_response
from app.modules.health.schemas.vaccination import VaccinationCreate, VaccinationUpdate, VaccinationResponse
from app.modules.health.services.vaccination_service import VaccinationService
from app.modules.health.dependencies import get_vaccination_service

router = APIRouter()

@router.post("", summary="Create a vaccination", status_code=201)
async def create_vaccination(
    payload: VaccinationCreate,
    pet: Pet = Depends(get_owned_pet),
    service: VaccinationService = Depends(get_vaccination_service),
) -> JSONResponse:
    vaccination = await service.create_vaccination(pet.id, payload)
    return created_response(data=VaccinationResponse.model_validate(vaccination).model_dump(mode="json"), message="Vaccination created.")

@router.get("", summary="List vaccinations for a pet")
async def list_vaccinations(
    pet: Pet = Depends(get_owned_pet),
    service: VaccinationService = Depends(get_vaccination_service),
) -> JSONResponse:
    vaccinations = await service.list_vaccinations(pet.id)
    data = [VaccinationResponse.model_validate(r).model_dump(mode="json") for r in vaccinations]
    return success_response(data=data, message="Vaccinations retrieved.")

@router.put("/{vaccination_id}", summary="Update a vaccination")
async def update_vaccination(
    vaccination_id: str,
    payload: VaccinationUpdate,
    pet: Pet = Depends(get_owned_pet),
    service: VaccinationService = Depends(get_vaccination_service),
) -> JSONResponse:
    vaccination = await service.update_vaccination(vaccination_id, payload)
    return success_response(data=VaccinationResponse.model_validate(vaccination).model_dump(mode="json"), message="Vaccination updated.")

@router.delete("/{vaccination_id}", summary="Delete a vaccination")
async def delete_vaccination(
    vaccination_id: str,
    pet: Pet = Depends(get_owned_pet),
    service: VaccinationService = Depends(get_vaccination_service),
) -> JSONResponse:
    await service.delete_vaccination(vaccination_id)
    return success_response(data=None, message="Vaccination deleted.")
