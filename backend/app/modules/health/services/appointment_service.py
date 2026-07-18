from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from typing import List
from app.modules.health.models.appointment import Appointment
from app.modules.health.schemas.appointment import AppointmentCreate, AppointmentUpdate
from app.modules.health.repositories.appointment_repo import AppointmentRepository
from fastapi import HTTPException, status

class AppointmentService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = AppointmentRepository(session)

    async def create_appointment(self, pet_id: str, data: AppointmentCreate) -> Appointment:
        appointment = Appointment(
            id=str(uuid.uuid4()),
            pet_id=pet_id,
            clinic_id=data.clinic_id,
            status="Scheduled",
            visit_date=data.visit_date,
            reason=data.reason,
            notes=data.notes,
            clinic_name=data.clinic_name,
            veterinarian=data.veterinarian
        )
        self.session.add(appointment)
        await self.session.commit()
        await self.session.refresh(appointment)
        return appointment

    async def list_appointments(self, pet_id: str) -> List[Appointment]:
        return await self.repo.get_by_pet_id(pet_id)

    async def update_appointment(self, appointment_id: str, data: AppointmentUpdate) -> Appointment:
        appointment = await self.repo.get_by_id(appointment_id)
        if not appointment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found.")
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(appointment, key, value)
            
        await self.session.commit()
        await self.session.refresh(appointment)
        return appointment

    async def delete_appointment(self, appointment_id: str) -> None:
        appointment = await self.repo.get_by_id(appointment_id)
        if not appointment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found.")
        
        await self.session.delete(appointment)
        await self.session.commit()
