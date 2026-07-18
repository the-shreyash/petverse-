from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.dependencies.pets import get_owned_pet
from app.modules.pet.models.pet import Pet
from app.utils.response import success_response, created_response
from app.modules.health.schemas.appointment import AppointmentCreate, AppointmentUpdate, AppointmentResponse
from app.modules.health.services.appointment_service import AppointmentService
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.common import get_db

router = APIRouter()

def get_appointment_service(session: AsyncSession = Depends(get_db)) -> AppointmentService:
    return AppointmentService(session)

@router.post("", summary="Create an appointment", status_code=201)
async def create_appointment(
    payload: AppointmentCreate,
    pet: Pet = Depends(get_owned_pet),
    service: AppointmentService = Depends(get_appointment_service),
) -> JSONResponse:
    appointment = await service.create_appointment(pet.id, payload)
    return created_response(data=AppointmentResponse.model_validate(appointment).model_dump(mode="json"), message="Appointment created.")

@router.get("", summary="List appointments for a pet")
async def list_appointments(
    pet: Pet = Depends(get_owned_pet),
    service: AppointmentService = Depends(get_appointment_service),
) -> JSONResponse:
    appointments = await service.list_appointments(pet.id)
    data = [AppointmentResponse.model_validate(a).model_dump(mode="json") for a in appointments]
    return success_response(data=data, message="Appointments retrieved.")

@router.put("/{appointment_id}", summary="Update an appointment")
async def update_appointment(
    appointment_id: str,
    payload: AppointmentUpdate,
    pet: Pet = Depends(get_owned_pet),
    service: AppointmentService = Depends(get_appointment_service),
) -> JSONResponse:
    appointment = await service.update_appointment(appointment_id, payload)
    return success_response(data=AppointmentResponse.model_validate(appointment).model_dump(mode="json"), message="Appointment updated.")

@router.delete("/{appointment_id}", summary="Delete an appointment")
async def delete_appointment(
    appointment_id: str,
    pet: Pet = Depends(get_owned_pet),
    service: AppointmentService = Depends(get_appointment_service),
) -> JSONResponse:
    await service.delete_appointment(appointment_id)
    return success_response(data=None, message="Appointment deleted.")
