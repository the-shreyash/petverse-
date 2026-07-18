from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload, selectinload

from app.core.repository import BaseRepository
from app.modules.community.models import Post

class PostRepository(BaseRepository[Post]):
    def __init__(self, session: AsyncSession):
        super().__init__(Post, session)

    def _engagement_options(self):
        return (
            joinedload(self.model.author),
            selectinload(self.model.likes),
            selectinload(self.model.bookmarks),
            selectinload(self.model.comments),
        )

    async def get_feed(self, skip: int = 0, limit: int = 100) -> list[Post]:
        # For now, feed is just the most recent public posts
        # Later this can be expanded with more complex logic (following, etc.)
        from app.modules.community.models.enums import PostVisibility
        stmt = self._not_deleted().options(
            *self._engagement_options()
        ).where(
            self.model.visibility == PostVisibility.PUBLIC
        ).order_by(self.model.created_at.desc()).offset(skip).limit(limit)

        result = await self.session.execute(stmt)
        return list(result.scalars().unique().all())

    async def get_full(self, post_id: str) -> Optional[Post]:
        from app.modules.community.models.comment import Comment
        stmt = self._not_deleted().options(
            *self._engagement_options(),
            selectinload(self.model.comments).joinedload(Comment.author),
        ).where(self.model.id == post_id)
        result = await self.session.execute(stmt)
        return result.scalars().unique().one_or_none()
