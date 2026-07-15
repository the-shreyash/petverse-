"""
app/modules/ai/repositories/ai_usage_repository.py

Repository for managing AI usage records.
"""

from app.core.repository import BaseRepository
from app.modules.ai.models.ai_usage import AIUsage


class AIUsageRepository(BaseRepository[AIUsage]):
    pass
