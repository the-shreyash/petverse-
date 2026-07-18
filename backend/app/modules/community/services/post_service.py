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

    def _serialize(self, post: Post, current_user_id: Optional[str], with_comments: bool = False) -> dict:
        likes = post.likes or []
        bookmarks = post.bookmarks or []
        comments = [c for c in (post.comments or []) if not getattr(c, "is_deleted", False)]

        data = {
            "id": post.id,
            "author_id": post.author_id,
            "author": self._author_dict(post.author),
            "content": post.content,
            "media_urls": post.media_urls or [],
            "visibility": post.visibility,
            "location": post.location,
            "pet_id": post.pet_id,
            "created_at": post.created_at,
            "updated_at": post.updated_at,
            "likes_count": len(likes),
            "comments_count": len(comments),
            "liked_by_me": any(l.user_id == current_user_id for l in likes) if current_user_id else False,
            "bookmarked_by_me": any(b.user_id == current_user_id for b in bookmarks) if current_user_id else False,
        }
        if with_comments:
            ordered = sorted(comments, key=lambda c: c.created_at or "")
            data["comments"] = [
                {
                    "id": c.id,
                    "post_id": c.post_id,
                    "author_id": c.author_id,
                    "content": c.content,
                    "parent_comment_id": c.parent_comment_id,
                    "created_at": c.created_at,
                    "author": self._author_dict(getattr(c, "author", None)),
                }
                for c in ordered
            ]
        return data

    async def create_post(self, user_id: str, data: PostCreate) -> dict:
        post = Post(**data.model_dump(), author_id=user_id)
        post = await self.repo.add(post)

        # Emit event
        await bus.publish(PostCreatedEvent(payload={"post_id": post.id, "author_id": user_id, "pet_id": post.pet_id}))

        # Re-fetch with eager-loaded relationships so the response has author + counts.
        full = await self.repo.get_full(post.id)
        return self._serialize(full or post, user_id, with_comments=True)

    async def get_feed(self, skip: int = 0, limit: int = 100, current_user_id: Optional[str] = None) -> list[dict]:
        posts = await self.repo.get_feed(skip=skip, limit=limit)
        return [self._serialize(p, current_user_id) for p in posts]

    async def get_post(self, post_id: str) -> Post:
        post = await self.repo.get_by_id(post_id)
        if not post:
            raise NotFoundException("Post not found")
        return post

    async def get_post_detail(self, post_id: str, current_user_id: Optional[str] = None) -> dict:
        post = await self.repo.get_full(post_id)
        if not post:
            raise NotFoundException("Post not found")
        return self._serialize(post, current_user_id, with_comments=True)

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
