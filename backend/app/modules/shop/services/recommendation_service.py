"""
app/modules/shop/services/recommendation_service.py

Acts as a bridge between the AI engine and the E-commerce catalog.
"""

from typing import Sequence, List
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
import logging

from app.modules.shop.models.product import Product
from app.modules.shop.repositories.shop_repositories import ProductRepository
from app.modules.ai.services.ai_service import AIService

logger = logging.getLogger(__name__)

class RecommendationService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.product_repo = ProductRepository(Product, session)
        self.ai_service = AIService(session)

    async def get_recommended_products(self, user_id: str, pet_id: str) -> Sequence[Product]:
        """
        Uses the AI engine to get category/action recommendations for a pet,
        then maps those recommendations to actual products in the DB.
        """
        try:
            ai_recs = await self.ai_service.get_recommendations(user_id, pet_id)
        except Exception as e:
            logger.error(f"Failed to get AI recommendations: {e}")
            # Fallback to random or popular products if AI fails
            return await self.product_repo.get_all(limit=5)
            
        # We now have ai_recs.recommendations (list of RecommendationItem)
        # We can search products matching the recommended categories or tags.
        
        target_categories = [r.category.upper() for r in ai_recs.recommendations]
        
        # In a real setup, we'd use full-text search or vector embeddings 
        # to match `r.recommended_actions` with `Product.description`.
        # For this prototype, we'll fetch products and filter in Python
        # or do a simple DB query based on medical tags/categories.
        
        all_products = await self.product_repo.get_all(limit=100)
        
        recommended_products = []
        for p in all_products:
            # Basic matching heuristic
            score = 0
            
            # Match by category
            if p.category and p.category.name.upper() in target_categories:
                score += 1
                
            # Try to match medical tags from AI recommendation reasons
            for r in ai_recs.recommendations:
                if p.medical_tags:
                    for tag in p.medical_tags:
                        if tag.lower() in r.reason.lower():
                            score += 2
                            
            if score > 0:
                recommended_products.append((score, p))
                
        # Sort by score descending and return top 10
        recommended_products.sort(key=lambda x: x[0], reverse=True)
        return [p[1] for p in recommended_products[:10]]
