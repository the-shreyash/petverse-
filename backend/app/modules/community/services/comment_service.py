from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.core.events.bus import bus
from app.modules.community.models import Comment
from app.modules.community.schemas.comment import CommentCreate
from app.modules.community.repositories.comment_repository import CommentRepository
from app.modules.community.services.post_service import PostService
from app.modules.community.events import CommentAddedEvent

class CommentService:
    def __init__(self, session: AsyncSession):
        self.repo = CommentRepository(session)
        self.post_service = PostService(session)

    async def add_comment(self, user_id: str, post_id: str, data: CommentCreate) -> Comment:
        # Verify post exists
        post = await self.post_service.get_post(post_id)

        # Verify parent comment exists if provided
        if data.parent_comment_id:
            parent = await self.repo.get_by_id(data.parent_comment_id)
            if not parent:
                raise NotFoundException("Parent comment not found")

        comment = Comment(**data.model_dump(), post_id=post_id, author_id=user_id)
        comment = await self.repo.add(comment)

        await bus.publish(CommentAddedEvent(payload={
            "comment_id": comment.id,
            "post_id": post_id,
            "author_id": user_id,
            "post_author_id": post.author_id
        }))

        return comment

    async def get_comments_for_post(self, post_id: str, skip: int = 0, limit: int = 100) -> list[Comment]:
        # Verify post exists
        await self.post_service.get_post(post_id)
        return await self.repo.get_by_post_id(post_id, skip=skip, limit=limit)

    async def delete_comment(self, user_id: str, comment_id: str) -> None:
        comment = await self.repo.get_by_id(comment_id)
        if not comment:
            raise NotFoundException("Comment not found")
        if comment.author_id != user_id:
            from app.core.exceptions import ForbiddenException
            raise ForbiddenException("You can only delete your own comments")

        await self.repo.delete(comment)
