from datetime import timedelta
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException, ForbiddenException
from app.utils.datetime_helper import utcnow
from app.modules.community.models.story import Story
from app.modules.community.schemas.story import StoryCreate
from app.modules.community.repositories.story_repository import StoryRepository

STORY_TTL_HOURS = 24


class StoryService:
    def __init__(self, session: AsyncSession):
        self.repo = StoryRepository(session)

    @staticmethod
    def _author_dict(user) -> Optional[dict]:
        if not user:
            return None
        return {
            "id": user.id,
            "first_name": user.first_name or "",
            "last_name": user.last_name or "",
            "avatar_url": getattr(user, "profile_image", None),
        }

    def _serialize(self, story: Story, current_user_id: Optional[str]) -> dict:
        views = story.views or []
        return {
            "id": story.id,
            "author_id": story.author_id,
            "author": self._author_dict(story.author),
            "pet_id": story.pet_id,
            "media_url": story.media_url,
            "media_type": story.media_type,
            "caption": story.caption,
            "created_at": story.created_at,
            "expires_at": story.expires_at,
            "views_count": len(views),
            "seen_by_me": any(v.viewer_id == current_user_id for v in views) if current_user_id else False,
        }

    async def create_story(self, user_id: str, data: StoryCreate) -> dict:
        story = Story(
            **data.model_dump(),
            author_id=user_id,
            expires_at=utcnow() + timedelta(hours=STORY_TTL_HOURS),
        )
        story = await self.repo.add(story)
        full = await self.repo.get_full(story.id)
        return self._serialize(full or story, user_id)

    async def get_active_stories(self, current_user_id: Optional[str] = None) -> list[dict]:
        stories = await self.repo.get_active()
        return [self._serialize(s, current_user_id) for s in stories]

    async def get_grouped_stories(self, current_user_id: Optional[str] = None) -> list[dict]:
        """Group active stories by author for the story rail.

        Authors whose stories the viewer has not fully seen sort first, matching
        how Instagram-style rails order unseen content.
        """
        stories = await self.repo.get_active()
        groups: dict[str, dict] = {}

        for story in stories:
            payload = self._serialize(story, current_user_id)
            group = groups.get(story.author_id)
            if not group:
                group = {
                    "author_id": story.author_id,
                    "author": payload["author"],
                    "stories": [],
                    "all_seen": True,
                    "latest_at": story.created_at,
                }
                groups[story.author_id] = group

            group["stories"].append(payload)
            if not payload["seen_by_me"]:
                group["all_seen"] = False
            if story.created_at and story.created_at > group["latest_at"]:
                group["latest_at"] = story.created_at

        for group in groups.values():
            # Within a group, play oldest first.
            group["stories"].sort(key=lambda s: s["created_at"])

        return sorted(
            groups.values(),
            key=lambda g: (g["all_seen"], -g["latest_at"].timestamp()),
        )

    async def mark_seen(self, story_id: str, viewer_id: str) -> dict:
        story = await self.repo.get_full(story_id)
        if not story:
            raise NotFoundException("Story not found")

        await self.repo.add_view(story_id, viewer_id)

        # The `views` collection is already loaded in the identity map, so a plain
        # re-query would hand back the pre-insert state. Expire it to force a reload.
        self.repo.session.expire(story, ["views"])
        refreshed = await self.repo.get_full(story_id)
        return self._serialize(refreshed or story, viewer_id)

    async def delete_story(self, user_id: str, story_id: str) -> None:
        story = await self.repo.get_by_id(story_id)
        if not story:
            raise NotFoundException("Story not found")
        if story.author_id != user_id:
            raise ForbiddenException("You can only delete your own stories")
        await self.repo.delete(story)
