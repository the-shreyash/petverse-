from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.repository import BaseRepository
from app.modules.community.models import Comment

class CommentRepository(BaseRepository[Comment]):
    def __init__(self, session: AsyncSession):
        super().__init__(Comment, session)

    async def get_by_post_id(self, post_id: str, skip: int = 0, limit: int = 100) -> list[Comment]:
        stmt = self._not_deleted().where(
            self.model.post_id == post_id
        ).order_by(self.model.created_at.desc()).offset(skip).limit(limit)
        
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
