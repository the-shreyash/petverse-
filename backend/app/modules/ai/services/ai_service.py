"""
app/modules/ai/services/ai_service.py

High-level AI Service coordinating providers, context, prompts, and history.
"""

from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.modules.ai.models.ai_history import AIConversation, AIMessage
from app.modules.ai.models.ai_usage import AIUsage
from app.modules.ai.repositories.ai_history_repository import AIConversationRepository, AIMessageRepository
from app.modules.ai.repositories.ai_usage_repository import AIUsageRepository
from app.modules.ai.providers.openai_provider import OpenAIProvider
from app.modules.ai.providers.gemini_provider import GeminiProvider
from app.modules.ai.context.context_builder import AIContextBuilder
from app.modules.ai.prompts.prompt_builder import PromptBuilder
from app.modules.ai.schemas.ai import ChatResponse, RecommendationResponse, RecommendationItem


class AIService:
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.conv_repo = AIConversationRepository(AIConversation, session)
        self.msg_repo = AIMessageRepository(AIMessage, session)
        self.usage_repo = AIUsageRepository(AIUsage, session)
        self.context_builder = AIContextBuilder(session)
        
        # Instantiate providers
        self.providers = {
            "openai": OpenAIProvider(),
            "gemini": GeminiProvider()
        }

    def _get_provider(self, name: str):
        provider = self.providers.get(name.lower())
        if not provider:
            raise HTTPException(status_code=400, detail=f"Unsupported AI provider: {name}")
        return provider

    async def chat(self, user_id: str, message: str, provider_name: str, conversation_id: Optional[str] = None, pet_id: Optional[str] = None) -> ChatResponse:
        provider = self._get_provider(provider_name)
        
        # Load or create conversation
        if conversation_id:
            conv = await self.conv_repo.get_with_messages(conversation_id)
            if not conv or conv.user_id != user_id:
                raise HTTPException(status_code=404, detail="Conversation not found")
        else:
            context_data = await self.context_builder.build_context(user_id, pet_id)
            conv = AIConversation(
                user_id=user_id,
                pet_id=pet_id,
                title=message[:50] + "...",
                context_snapshot=context_data
            )
            await self.conv_repo.add(conv)
            
        # Build prompt context
        # If continuing, we use the saved context, else we fetch fresh context
        context_data = conv.context_snapshot or await self.context_builder.build_context(user_id, pet_id)
        system_prompt = PromptBuilder.build_chat_prompt(context_data)
        
        # Build message history for provider
        history_msgs = []
        if conversation_id and hasattr(conv, "messages"):
            for m in conv.messages:
                history_msgs.append({"role": m.role, "content": m.content})
        
        # Add the new user message
        history_msgs.append({"role": "user", "content": message})
        
        # Save user message to DB
        user_msg = AIMessage(
            conversation_id=conv.id,
            role="user",
            content=message
        )
        await self.msg_repo.add(user_msg)
        
        # Generate response
        try:
            ai_resp = await provider.generate_chat_response(system_prompt, history_msgs)
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"AI Provider error: {str(e)}")
            
        # Save assistant message
        asst_msg = AIMessage(
            conversation_id=conv.id,
            role="assistant",
            content=ai_resp.message,
            metadata_json={"model": ai_resp.model_name, "tokens": ai_resp.total_tokens}
        )
        await self.msg_repo.add(asst_msg)
        
        # Save usage
        usage = AIUsage(
            user_id=user_id,
            conversation_id=conv.id,
            provider=provider_name,
            model_name=ai_resp.model_name,
            prompt_tokens=ai_resp.prompt_tokens,
            completion_tokens=ai_resp.completion_tokens,
            total_tokens=ai_resp.total_tokens
        )
        await self.usage_repo.add(usage)
        
        return ChatResponse(
            conversation_id=conv.id,
            message=ai_resp.message,
            provider=provider_name,
            tokens_used=ai_resp.total_tokens
        )
        
    async def get_recommendations(self, user_id: str, pet_id: str, category: Optional[str] = None, provider_name: str = "gemini") -> RecommendationResponse:
        """Generates structured product/action recommendations for a pet."""
        provider = self._get_provider(provider_name)
        
        context_data = await self.context_builder.build_context(user_id, pet_id)
        if not context_data.get("pets"):
            raise HTTPException(status_code=404, detail="Pet not found or does not belong to user")
            
        system_prompt = PromptBuilder.build_recommendation_prompt(context_data, category)
        user_prompt = "Generate the best personalized recommendations for my pet."
        
        # We need an intermediate schema to handle the list of items
        from pydantic import BaseModel
        class RecList(BaseModel):
            recommendations: List[RecommendationItem]
            
        try:
            parsed_data, ai_resp = await provider.generate_structured_response(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                response_schema=RecList
            )
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"AI Provider error: {str(e)}")
            
        # Save usage
        usage = AIUsage(
            user_id=user_id,
            provider=provider_name,
            model_name=ai_resp.model_name,
            prompt_tokens=ai_resp.prompt_tokens,
            completion_tokens=ai_resp.completion_tokens,
            total_tokens=ai_resp.total_tokens
        )
        await self.usage_repo.add(usage)
        
        return RecommendationResponse(
            pet_id=pet_id,
            recommendations=parsed_data.recommendations
        )
