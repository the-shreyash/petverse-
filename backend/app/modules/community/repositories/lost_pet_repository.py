from sqlalchemy.ext.asyncio import AsyncSession

from app.core.repository import BaseRepository
from app.modules.community.models import LostPet

class LostPetRepository(BaseRepository[LostPet]):
    def __init__(self, session: AsyncSession):
        super().__init__(LostPet, session)
