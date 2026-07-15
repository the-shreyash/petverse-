"""
app/modules/ai/providers/openai_provider.py

Implementation of the OpenAI provider.
"""

import json
from typing import List, Dict, Any, Tuple, Optional
from openai import AsyncOpenAI

from app.modules.ai.providers.base import AIProvider, AIProviderResponse
from app.core.config import get_settings

class OpenAIProvider(AIProvider):
    
    def __init__(self):
        settings = get_settings()
        self.api_key = settings.OPENAI_API_KEY
        # If API key is not set, we can still instantiate, but calls will fail later.
        self.client = AsyncOpenAI(api_key=self.api_key) if self.api_key else None
        self.default_model = "gpt-4o"
        
    def _ensure_client(self):
        if not self.client:
            raise ValueError("OPENAI_API_KEY is not configured.")

    async def generate_chat_response(
        self,
        system_prompt: str,
        messages: List[Dict[str, str]], 
        model: Optional[str] = None
    ) -> AIProviderResponse:
        self._ensure_client()
        target_model = model or self.default_model
        
        oai_messages = [{"role": "system", "content": system_prompt}]
        for msg in messages:
            oai_messages.append({"role": msg["role"], "content": msg["content"]})
            
        response = await self.client.chat.completions.create(
            model=target_model,
            messages=oai_messages,
        ) # type: ignore
        
        choice = response.choices[0]
        usage = response.usage
        
        return AIProviderResponse(
            message=choice.message.content or "",
            prompt_tokens=usage.prompt_tokens if usage else 0,
            completion_tokens=usage.completion_tokens if usage else 0,
            total_tokens=usage.total_tokens if usage else 0,
            model_name=target_model
        )

    async def generate_structured_response(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Any,
        model: Optional[str] = None
    ) -> Tuple[Any, AIProviderResponse]:
        self._ensure_client()
        target_model = model or self.default_model
        
        # In a real app we'd use response_format={"type": "json_schema", ...} 
        # or Instructor library. For simplicity, we ask for JSON.
        
        # Provide a hint about the schema in the system prompt
        schema_json = response_schema.model_json_schema()
        full_system_prompt = f"{system_prompt}\n\nYou must respond in JSON format that matches this JSON Schema:\n{json.dumps(schema_json)}"
        
        response = await self.client.chat.completions.create(
            model=target_model,
            messages=[
                {"role": "system", "content": full_system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        ) # type: ignore
        
        content = response.choices[0].message.content
        usage = response.usage
        
        parsed_obj = response_schema.model_validate_json(content)
        
        ai_response = AIProviderResponse(
            message=content or "",
            prompt_tokens=usage.prompt_tokens if usage else 0,
            completion_tokens=usage.completion_tokens if usage else 0,
            total_tokens=usage.total_tokens if usage else 0,
            model_name=target_model
        )
        
        return parsed_obj, ai_response
