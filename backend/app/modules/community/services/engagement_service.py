from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictException, NotFoundException
from app.core.events.bus import bus
from app.modules.community.models import Like, Bookmark
from app.modules.community.repositories.engagement_repository import LikeRepository, BookmarkRepository
from app.modules.community.services.post_service import PostService
from app.modules.community.events import LikeAddedEvent

class EngagementService:
    def __init__(self, session: AsyncSession):
        self.like_repo = LikeRepository(session)
        self.bookmark_repo = BookmarkRepository(session)
        self.post_service = PostService(session)

    async def add_like(self, user_id: str, post_id: str) -> Like:
        post = await self.post_service.get_post(post_id)
        existing = await self.like_repo.get_like(post_id, user_id)
        if existing:
            raise ConflictException("You have already liked this post")

        like = Like(user_id=user_id, post_id=post_id)
        like = await self.like_repo.add(like)

        await bus.publish(LikeAddedEvent(payload={
            "like_id": like.id,
            "post_id": post_id,
            "user_id": user_id,
            "post_author_id": post.author_id
        }))

        return like

    async def remove_like(self, user_id: str, post_id: str) -> None:
        like = await self.like_repo.get_like(post_id, user_id)
        if not like:
            raise NotFoundException("Like not found")
        await self.like_repo.delete(like, hard=True)

    async def add_bookmark(self, user_id: str, post_id: str) -> Bookmark:
        await self.post_service.get_post(post_id)
        existing = await self.bookmark_repo.get_bookmark(post_id, user_id)
        if existing:
            raise ConflictException("You have already bookmarked this post")

        bookmark = Bookmark(user_id=user_id, post_id=post_id)
        return await self.bookmark_repo.add(bookmark)

    async def remove_bookmark(self, user_id: str, post_id: str) -> None:
        bookmark = await self.bookmark_repo.get_bookmark(post_id, user_id)
        if not bookmark:
            raise NotFoundException("Bookmark not found")
        await self.bookmark_repo.delete(bookmark, hard=True)
