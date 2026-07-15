"""
app/modules/health/repositories/vaccination_repo.py
"""

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.health.models.vaccination import Vaccination


from app.core.repository import BaseRepository

class VaccinationRepository(BaseRepository[Vaccination]):
    def __init__(self, session: AsyncSession):
        super().__init__(Vaccination, session)

    async def list_by_pet(self, pet_id: str) -> Sequence[Vaccination]:
        result = await self.session.execute(
            self._not_deleted().where(Vaccination.pet_id == pet_id).order_by(Vaccination.administration_date.desc())
        )
        return result.scalars().all()


