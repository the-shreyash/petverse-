from fastapi import APIRouter

from .feed import router as feed_router
from .posts import router as posts_router
from .adoption import router as adoption_router
from .lost_pet import router as lost_pet_router

# Community specific router
community_router = APIRouter(prefix="/community")
community_router.include_router(feed_router)
community_router.include_router(posts_router)

# Exposed routers for root api.py inclusion
__all__ = ["community_router", "adoption_router", "lost_pet_router"]
