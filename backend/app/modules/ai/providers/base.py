"""
app/modules/ai/providers/base.py

Abstract base class for all AI providers.
"""

import abc
from typing import List, Dict, Any, Tuple, Optional
from pydantic import BaseModel

class AIProviderResponse(BaseModel):
    message: str
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    model_name: str


class AIProvider(abc.ABC):
    """Abstract interface for AI Providers."""

    @abc.abstractmethod
    async def generate_chat_response(
        self,
        system_prompt: str,
        messages: List[Dict[str, str]], 
        model: Optional[str] = None
    ) -> AIProviderResponse:
        """
        Generates a chat response.
        
        Args:
            system_prompt: The system prompt (context)
            messages: List of message dicts with 'role' (user/assistant) and 'content'
            model: Optional model override
        """
        pass
        
    @abc.abstractmethod
    async def generate_structured_response(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Any,
        model: Optional[str] = None
    ) -> Tuple[Any, AIProviderResponse]:
        """
        Generates a structured JSON response matching the given schema.
        
        Args:
            system_prompt: The system prompt
            user_prompt: The user input
            response_schema: A Pydantic model class to parse the response into
            model: Optional model override
            
        Returns:
            A tuple of (parsed_pydantic_object, usage_stats)
        """
        pass
