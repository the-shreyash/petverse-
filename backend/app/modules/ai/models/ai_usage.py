"""
app/modules/ai/models/ai_usage.py

Model for tracking AI token usage, costs, and performance.
"""

from __future__ import annotations
from typing import Optional

from sqlalchemy import ForeignKey, String, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class AIUsage(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Tracks token usage and performance of AI requests."""
    __tablename__ = "ai_usage"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True)
    conversation_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("ai_conversations.id", ondelete="SET NULL"), index=True, nullable=True)
    
    provider: Mapped[str] = mapped_column(String(50), nullable=False) # 'openai', 'gemini'
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    
    prompt_tokens: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    completion_tokens: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_tokens: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    # Optional cost tracking (e.g. 0.0002)
    estimated_cost: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    # Performance tracking in milliseconds
    response_time_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    def __repr__(self) -> str:
        return f"<AIUsage id={self.id} provider={self.provider} model={self.model_name}>"
