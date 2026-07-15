"""
app/modules/health/services/weight_service.py
"""

from typing import Sequence
from app.modules.health.models import WeightHistory
from app.modules.health.schemas import WeightHistoryCreate
from app.modules.health.repositories import WeightRepository


class WeightService:
    def __init__(self, repository: WeightRepository):
        self.repository = repository

    async def create_weight_history(self, pet_id: str, data: WeightHistoryCreate) -> WeightHistory:
        weight = WeightHistory(pet_id=pet_id, **data.model_dump())
        return await self.repository.add(weight)

    async def get_weight_history(self, weight_id: str) -> WeightHistory:
        weight = await self.repository.get_by_id(weight_id)
        if not weight:
            raise ValueError("Weight Record not found")
        return weight

    async def list_weight_histories(self, pet_id: str) -> Sequence[WeightHistory]:
        return await self.repository.list_by_pet(pet_id)

    async def delete_weight_history(self, weight_id: str) -> None:
        weight = await self.get_weight_history(weight_id)
        await self.repository.delete(weight)
