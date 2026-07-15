"""
app/modules/health/repositories/weight_repo.py
"""

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.health.models.weight import WeightHistory


from app.core.repository import BaseRepository

class WeightRepository(BaseRepository[WeightHistory]):
    def __init__(self, session: AsyncSession):
        super().__init__(WeightHistory, session)

    async def list_by_pet(self, pet_id: str) -> Sequence[WeightHistory]:
        result = await self.session.execute(
            self._not_deleted().where(WeightHistory.pet_id == pet_id).order_by(WeightHistory.recorded_at.desc())
        )
        return result.scalars().all()


