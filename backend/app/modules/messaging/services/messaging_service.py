from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException, ForbiddenException, ValidationException
from app.core.events.bus import bus
from app.utils.datetime_helper import utcnow
from app.modules.messaging.models.conversation import Conversation, Message
from app.modules.messaging.repositories.conversation_repository import ConversationRepository
from app.modules.messaging.schemas.message import ConversationCreate, MessageCreate
from app.modules.messaging.events import MessageSentEvent


class MessagingService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = ConversationRepository(session)

    @staticmethod
    def _user_dict(user) -> Optional[dict]:
        if not user:
            return None
        return {
            "id": user.id,
            "first_name": user.first_name or "",
            "last_name": user.last_name or "",
            "avatar_url": getattr(user, "profile_image", None),
        }

    def _other_participant(self, conversation: Conversation, user_id: str):
        for p in conversation.participants or []:
            if p.user_id != user_id:
                return p
        return None

    def _serialize_message(self, msg: Message, user_id: str, other_last_read=None) -> dict:
        return {
            "id": msg.id,
            "conversation_id": msg.conversation_id,
            "sender_id": msg.sender_id,
            "sender": self._user_dict(getattr(msg, "sender", None)),
            "content": msg.content,
            "media_url": msg.media_url,
            "created_at": msg.created_at,
            "is_mine": msg.sender_id == user_id,
            # "Read" means the other party's read cursor has passed this message.
            "read_by_other": bool(
                msg.sender_id == user_id
                and other_last_read is not None
                and msg.created_at is not None
                and other_last_read >= msg.created_at
            ),
        }

    async def _assert_member(self, conversation_id: str, user_id: str):
        participant = await self.repo.get_participant(conversation_id, user_id)
        if not participant:
            raise ForbiddenException("You are not a participant in this conversation")
        return participant

    async def get_or_create_direct(self, user_id: str, data: ConversationCreate) -> dict:
        if data.participant_id == user_id:
            raise ValidationException("You cannot start a conversation with yourself")

        conversation = await self.repo.find_direct(user_id, data.participant_id)
        if not conversation:
            conversation = Conversation(listing_id=data.listing_id, pet_id=data.pet_id)
            conversation = await self.repo.add(conversation)
            await self.repo.add_participant(conversation.id, user_id)
            await self.repo.add_participant(conversation.id, data.participant_id)
            await self.session.flush()

        if data.message:
            await self.send_message(user_id, conversation.id, MessageCreate(content=data.message))

        full = await self.repo.get_full(conversation.id)
        return await self._serialize_conversation(full, user_id)

    async def _serialize_conversation(self, conversation: Conversation, user_id: str) -> dict:
        other = self._other_participant(conversation, user_id)
        me = next((p for p in conversation.participants or [] if p.user_id == user_id), None)

        last = await self.repo.get_last_message(conversation.id)
        unread = await self.repo.count_unread(
            conversation.id, user_id, me.last_read_at if me else None
        )

        return {
            "id": conversation.id,
            "other_user": self._user_dict(other.user if other else None),
            "listing_id": conversation.listing_id,
            "pet_id": conversation.pet_id,
            "last_message": self._serialize_message(last, user_id) if last else None,
            "last_message_at": conversation.last_message_at,
            "unread_count": unread,
            "created_at": conversation.created_at,
        }

    async def list_conversations(self, user_id: str) -> list[dict]:
        conversations = await self.repo.list_for_user(user_id)
        return [await self._serialize_conversation(c, user_id) for c in conversations]

    async def get_conversation(self, user_id: str, conversation_id: str) -> dict:
        await self._assert_member(conversation_id, user_id)
        conversation = await self.repo.get_full(conversation_id)
        if not conversation:
            raise NotFoundException("Conversation not found")

        other = self._other_participant(conversation, user_id)
        other_last_read = other.last_read_at if other else None

        messages = await self.repo.get_messages(conversation_id)
        data = await self._serialize_conversation(conversation, user_id)
        data["messages"] = [self._serialize_message(m, user_id, other_last_read) for m in messages]
        return data

    async def send_message(self, user_id: str, conversation_id: str, data: MessageCreate) -> dict:
        await self._assert_member(conversation_id, user_id)

        if not (data.content and data.content.strip()) and not data.media_url:
            raise ValidationException("A message must have text or media")

        conversation = await self.repo.get_full(conversation_id)
        if not conversation:
            raise NotFoundException("Conversation not found")

        # Resolve the recipient *before* touching the conversation: repo.save()
        # calls session.refresh(), which expires the eagerly-loaded participants
        # collection and turns a later read into a sync lazy-load (MissingGreenlet).
        recipient = self._other_participant(conversation, user_id)
        recipient_id = recipient.user_id if recipient else None

        msg = Message(
            conversation_id=conversation_id,
            sender_id=user_id,
            content=(data.content or "").strip() or None,
            media_url=data.media_url,
        )
        msg = await self.repo.add_message(msg)

        conversation.last_message_at = msg.created_at
        await self.repo.save(conversation)

        if recipient_id:
            await bus.publish(
                MessageSentEvent(
                    payload={
                        "message_id": msg.id,
                        "conversation_id": conversation_id,
                        "sender_id": user_id,
                        "recipient_id": recipient_id,
                        "preview": (msg.content or "Sent an image")[:80],
                    }
                )
            )

        full_msg = await self.repo.get_last_message(conversation_id)
        return self._serialize_message(full_msg or msg, user_id)

    async def mark_read(self, user_id: str, conversation_id: str) -> dict:
        participant = await self._assert_member(conversation_id, user_id)
        participant.last_read_at = utcnow()
        self.session.add(participant)
        await self.session.flush()
        conversation = await self.repo.get_full(conversation_id)
        return await self._serialize_conversation(conversation, user_id)
