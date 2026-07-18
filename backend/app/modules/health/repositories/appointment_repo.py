from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.health.models.appointment import Appointment
from app.core.repository import BaseRepository

class AppointmentRepository(BaseRepository[Appointment]):
    def __init__(self, session: AsyncSession):
        super().__init__(Appointment, session)

    async def get_by_pet_id(self, pet_id: str) -> List[Appointment]:
        stmt = select(self.model).where(self.model.pet_id == pet_id).order_by(self.model.visit_date.desc())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
