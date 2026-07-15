"""
app/modules/health/repositories/medication_repo.py
"""

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.health.models.medication import Medication


from app.core.repository import BaseRepository

class MedicationRepository(BaseRepository[Medication]):
    def __init__(self, session: AsyncSession):
        super().__init__(Medication, session)

    async def list_by_pet(self, pet_id: str) -> Sequence[Medication]:
        result = await self.session.execute(
            self._not_deleted().where(Medication.pet_id == pet_id).order_by(Medication.start_date.desc())
        )
        return result.scalars().all()


