"""
app/modules/health/routers/medical_records.py
"""

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.dependencies.pets import get_owned_pet
from app.modules.pet.models.pet import Pet
from app.utils.response import success_response, created_response
from app.modules.health.schemas.medical_record import MedicalRecordCreate, MedicalRecordUpdate, MedicalRecordResponse
from app.modules.health.services.medical_record_service import MedicalRecordService
from app.modules.health.dependencies import get_medical_service

router = APIRouter()

@router.post("", summary="Create a medical record", status_code=201)
async def create_record(
    payload: MedicalRecordCreate,
    pet: Pet = Depends(get_owned_pet),
    service: MedicalRecordService = Depends(get_medical_service),
) -> JSONResponse:
    record = await service.create_record(pet.id, payload)
    return created_response(data=MedicalRecordResponse.model_validate(record).model_dump(mode="json"), message="Medical record created.")

@router.get("", summary="List medical records for a pet")
async def list_records(
    pet: Pet = Depends(get_owned_pet),
    service: MedicalRecordService = Depends(get_medical_service),
) -> JSONResponse:
    records = await service.list_records(pet.id)
    data = [MedicalRecordResponse.model_validate(r).model_dump(mode="json") for r in records]
    return success_response(data=data, message="Medical records retrieved.")

@router.put("/{record_id}", summary="Update a medical record")
async def update_record(
    record_id: str,
    payload: MedicalRecordUpdate,
    pet: Pet = Depends(get_owned_pet),
    service: MedicalRecordService = Depends(get_medical_service),
) -> JSONResponse:
    record = await service.update_record(record_id, payload)
    return success_response(data=MedicalRecordResponse.model_validate(record).model_dump(mode="json"), message="Medical record updated.")

@router.delete("/{record_id}", summary="Delete a medical record")
async def delete_record(
    record_id: str,
    pet: Pet = Depends(get_owned_pet),
    service: MedicalRecordService = Depends(get_medical_service),
) -> JSONResponse:
    await service.delete_record(record_id)
    return success_response(data=None, message="Medical record deleted.")
