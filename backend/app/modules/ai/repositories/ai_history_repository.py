"""
app/modules/ai/repositories/ai_history_repository.py

Repository for managing AI conversations and messages.
"""

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.repository import BaseRepository
from app.modules.ai.models.ai_history import AIConversation, AIMessage


class AIConversationRepository(BaseRepository[AIConversation]):
    
    async def get_by_user_id(self, user_id: str, limit: int = 50) -> Sequence[AIConversation]:
        stmt = (
            select(self.model)
            .where(self.model.user_id == user_id)
            .order_by(self.model.created_at.desc())
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()
        
    async def get_with_messages(self, conversation_id: str) -> Optional[AIConversation]:
        stmt = (
            select(self.model)
            .options(selectinload(self.model.messages))
            .where(self.model.id == conversation_id)
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()


class AIMessageRepository(BaseRepository[AIMessage]):
    pass
