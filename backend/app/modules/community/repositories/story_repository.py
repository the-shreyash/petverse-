from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload, selectinload

from app.core.repository import BaseRepository
from app.utils.datetime_helper import utcnow
from app.modules.community.models.story import Story, StoryView


class StoryRepository(BaseRepository[Story]):
    def __init__(self, session: AsyncSession):
        super().__init__(Story, session)

    def _options(self):
        return (
            joinedload(self.model.author),
            selectinload(self.model.views),
        )

    async def get_active(self, skip: int = 0, limit: int = 200) -> list[Story]:
        """Unexpired stories, newest first."""
        stmt = (
            self._not_deleted()
            .options(*self._options())
            .where(self.model.expires_at > utcnow())
            .order_by(self.model.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().unique().all())

    async def get_full(self, story_id: str) -> Optional[Story]:
        stmt = self._not_deleted().options(*self._options()).where(self.model.id == story_id)
        result = await self.session.execute(stmt)
        return result.scalars().unique().one_or_none()

    async def get_view(self, story_id: str, viewer_id: str) -> Optional[StoryView]:
        stmt = select(StoryView).where(
            StoryView.story_id == story_id,
            StoryView.viewer_id == viewer_id,
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def add_view(self, story_id: str, viewer_id: str) -> StoryView:
        existing = await self.get_view(story_id, viewer_id)
        if existing:
            return existing
        view = StoryView(story_id=story_id, viewer_id=viewer_id)
        self.session.add(view)
        await self.session.flush()
        await self.session.refresh(view)
        return view
