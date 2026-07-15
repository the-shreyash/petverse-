"""
app/modules/health/repositories/medical_record_repo.py
"""

from typing import Optional, Sequence
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.health.models.medical_record import MedicalRecord


from app.core.repository import BaseRepository

class MedicalRecordRepository(BaseRepository[MedicalRecord]):
    def __init__(self, session: AsyncSession):
        super().__init__(MedicalRecord, session)

    async def list_by_pet(self, pet_id: str) -> Sequence[MedicalRecord]:
        result = await self.session.execute(
            self._not_deleted().where(MedicalRecord.pet_id == pet_id).order_by(MedicalRecord.visit_date.desc())
        )
        return result.scalars().all()


