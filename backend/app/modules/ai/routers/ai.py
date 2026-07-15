"""
app/modules/ai/routers/ai.py

FastAPI router for AI Engine endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database.engine import get_db
from app.modules.ai.schemas.ai import ChatMessageRequest, ChatResponse, RecommendationRequest, RecommendationResponse, AIConversationSchema
from app.modules.ai.services.ai_service import AIService
from app.modules.ai.utils.rate_limiter import AIRateLimiter
from app.modules.ai.repositories.ai_history_repository import AIConversationRepository
from app.modules.ai.models.ai_history import AIConversation

router = APIRouter()
rate_limiter = AIRateLimiter()

# In a real app we'd use a dependency like get_current_user to get the authenticated user ID.
# For Phase B, we might still be building auth or passing it differently.
# Here we'll simulate a logged-in user or require a user_id header/query for testing.
from fastapi import Header

async def get_current_user_id(x_user_id: str = Header(..., description="Simulated Auth User ID")) -> str:
    return x_user_id

@router.post("/chat", response_model=ChatResponse, summary="Send a message to the AI assistant")
async def chat_with_ai(
    request: ChatMessageRequest,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db)
):
    rate_limiter.check_rate_limit(user_id)
    service = AIService(session)
    return await service.chat(
        user_id=user_id,
        message=request.message,
        provider_name=request.provider or "gemini",
        conversation_id=request.conversation_id,
        pet_id=request.pet_id
    )

@router.get("/history", response_model=List[AIConversationSchema], summary="Get AI conversation history")
async def get_ai_history(
    limit: int = 20,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db)
):
    repo = AIConversationRepository(AIConversation, session)
    return await repo.get_by_user_id(user_id, limit=limit)

@router.post("/recommendations", response_model=RecommendationResponse, summary="Get AI-powered recommendations")
async def get_recommendations(
    request: RecommendationRequest,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_db)
):
    rate_limiter.check_rate_limit(user_id)
    service = AIService(session)
    return await service.get_recommendations(
        user_id=user_id,
        pet_id=request.pet_id,
        category=request.category,
        provider_name="gemini"
    )
