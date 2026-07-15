"""
app/modules/ai/prompts/prompt_builder.py

Contains reusable system prompts for various AI contexts.
"""
import json
from typing import Dict, Any

class PromptBuilder:
    """Provides structured prompts tailored to the pet context."""
    
    @staticmethod
    def build_chat_prompt(context: Dict[str, Any]) -> str:
        """General chat system prompt with context."""
        
        context_str = json.dumps(context, indent=2)
        
        return f"""
You are the AI Assistant for PetVerse, a comprehensive pet care platform.
Your goal is to provide helpful, accurate, and empathetic advice to pet owners.

Here is the context of the user and their pets:
{context_str}

Guidelines:
1. If the user asks about a specific pet, use the context provided to tailor your advice (e.g., considering their breed, age, weight, and medical tags).
2. If the user asks a medical question, remind them that you are an AI and they should consult a veterinarian for serious issues.
3. Keep your answers concise, structured, and friendly.
"""

    @staticmethod
    def build_recommendation_prompt(context: Dict[str, Any], category: str = None) -> str:
        """Prompt to generate product/action recommendations."""
        
        context_str = json.dumps(context, indent=2)
        cat_filter = f"Focus strictly on the '{category}' category." if category else "Provide general recommendations across food, toys, and health."
        
        return f"""
You are the PetVerse AI Recommendation Engine.
Based on the following pet context, suggest highly personalized recommendations.

Pet Context:
{context_str}

{cat_filter}

You must return a list of recommendations where each item has:
- priority (HIGH, MEDIUM, LOW)
- confidence (0.0 to 1.0)
- reason (Why this is recommended)
- recommended_actions (List of specific advice)
- category (e.g., NUTRITION, HEALTH, TOYS, ACCESSORIES)
"""
