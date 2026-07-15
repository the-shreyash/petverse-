from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.core.events.bus import bus
from app.modules.community.models import Post
from app.modules.community.schemas.post import PostCreate, PostUpdate
from app.modules.community.repositories.post_repository import PostRepository
from app.modules.community.events import PostCreatedEvent

class PostService:
    def __init__(self, session: AsyncSession):
        self.repo = PostRepository(session)

    async def create_post(self, user_id: str, data: PostCreate) -> Post:
        post = Post(**data.model_dump(), author_id=user_id)
        post = await self.repo.add(post)

        # Emit event
        await bus.publish(PostCreatedEvent(payload={"post_id": post.id, "author_id": user_id, "pet_id": post.pet_id}))

        return post

    async def get_feed(self, skip: int = 0, limit: int = 100) -> list[Post]:
        return await self.repo.get_feed(skip=skip, limit=limit)

    async def get_post(self, post_id: str) -> Post:
        post = await self.repo.get_by_id(post_id)
        if not post:
            raise NotFoundException("Post not found")
        return post

    async def update_post(self, user_id: str, post_id: str, data: PostUpdate) -> Post:
        post = await self.get_post(post_id)
        if post.author_id != user_id:
            from app.core.exceptions import ForbiddenException
            raise ForbiddenException("You can only edit your own posts")

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(post, key, value)
            
        return await self.repo.save(post)

    async def delete_post(self, user_id: str, post_id: str) -> None:
        post = await self.get_post(post_id)
        if post.author_id != user_id:
            from app.core.exceptions import ForbiddenException
            raise ForbiddenException("You can only delete your own posts")

        await self.repo.delete(post)
