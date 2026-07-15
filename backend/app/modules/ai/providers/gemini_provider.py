"""
app/modules/ai/providers/gemini_provider.py

Implementation of the Google Gemini provider.
"""

import json
from typing import List, Dict, Any, Tuple, Optional
import google.generativeai as genai

from app.modules.ai.providers.base import AIProvider, AIProviderResponse
from app.core.config import get_settings

class GeminiProvider(AIProvider):
    
    def __init__(self):
        settings = get_settings()
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key:
            genai.configure(api_key=self.api_key)
        self.is_configured = bool(self.api_key)
        self.default_model = "gemini-1.5-pro"
        
    def _ensure_configured(self):
        if not self.is_configured:
            raise ValueError("GEMINI_API_KEY is not configured.")

    async def generate_chat_response(
        self,
        system_prompt: str,
        messages: List[Dict[str, str]], 
        model: Optional[str] = None
    ) -> AIProviderResponse:
        self._ensure_configured()
        target_model_name = model or self.default_model
        
        target_model = genai.GenerativeModel(
            model_name=target_model_name,
            system_instruction=system_prompt
        )
        
        # Convert our standard [{"role": "user/assistant", "content": "..."}] 
        # to Gemini's format: [{"role": "user/model", "parts": ["..."]}]
        gemini_history = []
        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            gemini_history.append({"role": role, "parts": [msg["content"]]})
            
        # The last message is usually the user prompt. For chat, we can just start a chat session.
        if gemini_history and gemini_history[-1]["role"] == "user":
            user_msg = gemini_history.pop()["parts"][0]
        else:
            user_msg = ""
            
        chat = target_model.start_chat(history=gemini_history)
        response = await chat.send_message_async(user_msg)
        
        # Approximate usage (Gemini SDK sometimes lacks detailed tokens in async chat)
        # Using a fallback for now.
        prompt_tokens = target_model.count_tokens(chat.history).total_tokens
        completion_tokens = target_model.count_tokens(response.text).total_tokens if response.text else 0
        
        return AIProviderResponse(
            message=response.text or "",
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=prompt_tokens + completion_tokens,
            model_name=target_model_name
        )

    async def generate_structured_response(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Any,
        model: Optional[str] = None
    ) -> Tuple[Any, AIProviderResponse]:
        self._ensure_configured()
        target_model_name = model or self.default_model
        
        # Gemini allows passing a JSON schema directly via generation_config
        generation_config = genai.types.GenerationConfig(
            response_mime_type="application/json",
            response_schema=response_schema
        )
        
        target_model = genai.GenerativeModel(
            model_name=target_model_name,
            system_instruction=system_prompt,
            generation_config=generation_config
        )
        
        response = await target_model.generate_content_async(user_prompt)
        content = response.text
        
        parsed_obj = response_schema.model_validate_json(content)
        
        # Approximate usage
        prompt_tokens = target_model.count_tokens(system_prompt + user_prompt).total_tokens
        completion_tokens = target_model.count_tokens(content).total_tokens if content else 0
        
        ai_response = AIProviderResponse(
            message=content or "",
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=prompt_tokens + completion_tokens,
            model_name=target_model_name
        )
        
        return parsed_obj, ai_response
