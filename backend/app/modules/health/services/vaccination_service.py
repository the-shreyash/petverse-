"""
app/modules/health/services/vaccination_service.py
"""

from typing import Sequence
from app.modules.health.models import Vaccination
from app.modules.health.schemas import VaccinationCreate, VaccinationUpdate
from app.modules.health.repositories import VaccinationRepository


class VaccinationService:
    def __init__(self, repository: VaccinationRepository):
        self.repository = repository

    async def create_vaccination(self, pet_id: str, data: VaccinationCreate) -> Vaccination:
        vaccination = Vaccination(pet_id=pet_id, **data.model_dump())
        return await self.repository.add(vaccination)

    async def get_vaccination(self, vaccination_id: str) -> Vaccination:
        vaccination = await self.repository.get_by_id(vaccination_id)
        if not vaccination:
            raise ValueError("Vaccination not found")
        return vaccination

    async def list_vaccinations(self, pet_id: str) -> Sequence[Vaccination]:
        return await self.repository.list_by_pet(pet_id)

    async def update_vaccination(self, vaccination_id: str, data: VaccinationUpdate) -> Vaccination:
        vaccination = await self.get_vaccination(vaccination_id)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(vaccination, key, value)
        return await self.repository.save(vaccination)

    async def delete_vaccination(self, vaccination_id: str) -> None:
        vaccination = await self.get_vaccination(vaccination_id)
        await self.repository.delete(vaccination)
