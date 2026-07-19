from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.core.repository import BaseRepository
from app.modules.messaging.models.conversation import (
    Conversation,
    ConversationParticipant,
    Message,
)


class ConversationRepository(BaseRepository[Conversation]):
    def __init__(self, session: AsyncSession):
        super().__init__(Conversation, session)

    def _options(self):
        return (
            selectinload(self.model.participants).joinedload(ConversationParticipant.user),
        )

    async def find_direct(self, user_a: str, user_b: str) -> Optional[Conversation]:
        """Find an existing 1:1 conversation containing exactly these two users."""
        pa = select(ConversationParticipant.conversation_id).where(
            ConversationParticipant.user_id == user_a
        )
        pb = select(ConversationParticipant.conversation_id).where(
            ConversationParticipant.user_id == user_b
        )
        stmt = (
            self._not_deleted()
            .options(*self._options())
            .where(self.model.id.in_(pa), self.model.id.in_(pb))
            .order_by(self.model.created_at.asc())
        )
        result = await self.session.execute(stmt)
        return result.scalars().unique().first()

    async def list_for_user(self, user_id: str) -> list[Conversation]:
        ids = select(ConversationParticipant.conversation_id).where(
            ConversationParticipant.user_id == user_id
        )
        stmt = (
            self._not_deleted()
            .options(*self._options())
            .where(self.model.id.in_(ids))
            # MySQL has no NULLS LAST; fall back to created_at so a conversation
            # with no messages yet still sorts sensibly.
            .order_by(
                func.coalesce(self.model.last_message_at, self.model.created_at).desc()
            )
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().unique().all())

    async def get_full(self, conversation_id: str) -> Optional[Conversation]:
        stmt = self._not_deleted().options(*self._options()).where(self.model.id == conversation_id)
        result = await self.session.execute(stmt)
        return result.scalars().unique().one_or_none()

    async def add_participant(self, conversation_id: str, user_id: str) -> ConversationParticipant:
        p = ConversationParticipant(conversation_id=conversation_id, user_id=user_id)
        self.session.add(p)
        await self.session.flush()
        return p

    async def get_participant(self, conversation_id: str, user_id: str) -> Optional[ConversationParticipant]:
        stmt = select(ConversationParticipant).where(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id == user_id,
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_messages(self, conversation_id: str, skip: int = 0, limit: int = 200) -> list[Message]:
        stmt = (
            select(Message)
            .options(joinedload(Message.sender))
            .where(Message.conversation_id == conversation_id, Message.is_deleted.is_(False))
            .order_by(Message.created_at.asc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().unique().all())

    async def get_last_message(self, conversation_id: str) -> Optional[Message]:
        stmt = (
            select(Message)
            .options(joinedload(Message.sender))
            .where(Message.conversation_id == conversation_id, Message.is_deleted.is_(False))
            .order_by(Message.created_at.desc())
            .limit(1)
        )
        result = await self.session.execute(stmt)
        return result.scalars().unique().first()

    async def add_message(self, message: Message) -> Message:
        self.session.add(message)
        await self.session.flush()
        await self.session.refresh(message)
        return message

    async def count_unread(self, conversation_id: str, user_id: str, last_read_at) -> int:
        stmt = select(func.count(Message.id)).where(
            Message.conversation_id == conversation_id,
            Message.sender_id != user_id,
            Message.is_deleted.is_(False),
        )
        if last_read_at is not None:
            stmt = stmt.where(Message.created_at > last_read_at)
        result = await self.session.execute(stmt)
        return int(result.scalar() or 0)
