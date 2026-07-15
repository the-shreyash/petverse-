"""
app/modules/health/services/medication_service.py
"""

from typing import Sequence
from app.modules.health.models import Medication
from app.modules.health.schemas import MedicationCreate, MedicationUpdate
from app.modules.health.repositories import MedicationRepository


class MedicationService:
    def __init__(self, repository: MedicationRepository):
        self.repository = repository

    async def create_medication(self, pet_id: str, data: MedicationCreate) -> Medication:
        medication = Medication(pet_id=pet_id, **data.model_dump())
        return await self.repository.add(medication)

    async def get_medication(self, medication_id: str) -> Medication:
        medication = await self.repository.get_by_id(medication_id)
        if not medication:
            raise ValueError("Medication not found")
        return medication

    async def list_medications(self, pet_id: str) -> Sequence[Medication]:
        return await self.repository.list_by_pet(pet_id)

    async def update_medication(self, medication_id: str, data: MedicationUpdate) -> Medication:
        medication = await self.get_medication(medication_id)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(medication, key, value)
        return await self.repository.save(medication)

    async def delete_medication(self, medication_id: str) -> None:
        medication = await self.get_medication(medication_id)
        await self.repository.delete(medication)
