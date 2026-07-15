from sqlalchemy.ext.asyncio import AsyncSession

from app.core.repository import BaseRepository
from app.modules.community.models import AdoptionListing

class AdoptionRepository(BaseRepository[AdoptionListing]):
    def __init__(self, session: AsyncSession):
        super().__init__(AdoptionListing, session)
