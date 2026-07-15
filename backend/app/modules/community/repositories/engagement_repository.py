from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.repository import BaseRepository
from app.modules.community.models import Like, Bookmark

class LikeRepository(BaseRepository[Like]):
    def __init__(self, session: AsyncSession):
        super().__init__(Like, session)

    async def get_like(self, post_id: str, user_id: str) -> Optional[Like]:
        stmt = select(self.model).where(
            self.model.post_id == post_id,
            self.model.user_id == user_id
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

class BookmarkRepository(BaseRepository[Bookmark]):
    def __init__(self, session: AsyncSession):
        super().__init__(Bookmark, session)

    async def get_bookmark(self, post_id: str, user_id: str) -> Optional[Bookmark]:
        stmt = select(self.model).where(
            self.model.post_id == post_id,
            self.model.user_id == user_id
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
