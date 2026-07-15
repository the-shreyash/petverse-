"""
app/modules/health/routers/medications.py
"""

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.dependencies.pets import get_owned_pet
from app.modules.pet.models.pet import Pet
from app.utils.response import success_response, created_response
from app.modules.health.schemas.medication import MedicationCreate, MedicationUpdate, MedicationResponse
from app.modules.health.services.medication_service import MedicationService
from app.modules.health.dependencies import get_medication_service

router = APIRouter()

@router.post("", summary="Create a medication", status_code=201)
async def create_medication(
    payload: MedicationCreate,
    pet: Pet = Depends(get_owned_pet),
    service: MedicationService = Depends(get_medication_service),
) -> JSONResponse:
    medication = await service.create_medication(pet.id, payload)
    return created_response(data=MedicationResponse.model_validate(medication).model_dump(mode="json"), message="Medication created.")

@router.get("", summary="List medications for a pet")
async def list_medications(
    pet: Pet = Depends(get_owned_pet),
    service: MedicationService = Depends(get_medication_service),
) -> JSONResponse:
    medications = await service.list_medications(pet.id)
    data = [MedicationResponse.model_validate(r).model_dump(mode="json") for r in medications]
    return success_response(data=data, message="Medications retrieved.")

@router.put("/{medication_id}", summary="Update a medication")
async def update_medication(
    medication_id: str,
    payload: MedicationUpdate,
    pet: Pet = Depends(get_owned_pet),
    service: MedicationService = Depends(get_medication_service),
) -> JSONResponse:
    medication = await service.update_medication(medication_id, payload)
    return success_response(data=MedicationResponse.model_validate(medication).model_dump(mode="json"), message="Medication updated.")

@router.delete("/{medication_id}", summary="Delete a medication")
async def delete_medication(
    medication_id: str,
    pet: Pet = Depends(get_owned_pet),
    service: MedicationService = Depends(get_medication_service),
) -> JSONResponse:
    await service.delete_medication(medication_id)
    return success_response(data=None, message="Medication deleted.")
