from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.repository import BaseRepository
from app.modules.community.models import Post

class PostRepository(BaseRepository[Post]):
    def __init__(self, session: AsyncSession):
        super().__init__(Post, session)

    async def get_feed(self, skip: int = 0, limit: int = 100) -> list[Post]:
        # For now, feed is just the most recent public posts
        # Later this can be expanded with more complex logic (following, etc.)
        from app.modules.community.models.enums import PostVisibility
        stmt = self._not_deleted().where(
            self.model.visibility == PostVisibility.PUBLIC
        ).order_by(self.model.created_at.desc()).offset(skip).limit(limit)
        
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
