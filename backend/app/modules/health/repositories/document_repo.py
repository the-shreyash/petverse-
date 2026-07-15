"""
app/modules/health/repositories/document_repo.py
"""

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.health.models.document import HealthDocument


from app.core.repository import BaseRepository

class DocumentRepository(BaseRepository[HealthDocument]):
    def __init__(self, session: AsyncSession):
        super().__init__(HealthDocument, session)

    async def list_by_pet(self, pet_id: str) -> Sequence[HealthDocument]:
        result = await self.session.execute(
            self._not_deleted().where(HealthDocument.pet_id == pet_id).order_by(HealthDocument.uploaded_at.desc())
        )
        return result.scalars().all()


