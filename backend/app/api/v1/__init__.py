"""
app/api/v1/__init__.py

Version 1 API router aggregator.

All v1 routers are imported and included here.
main.py includes this single router under the /api/v1 prefix.

Adding a new Phase B router:
    1. Create app/api/v1/routers/your_router.py
    2. Import it here and call api_v1_router.include_router(...)
    3. No changes needed in main.py
"""

from fastapi import APIRouter

from app.modules.auth.routers.auth import router as auth_router
from app.modules.auth.routers.oauth import router as oauth_router
from app.api.v1.health import router as health_router
from app.modules.pet.routers.pets import router as pets_router
from app.modules.user.routers.users import router as users_router
from app.modules.health.routers import health_module_router
from app.modules.dashboard.routers import dashboard_router
from app.modules.ai.routers.ai import router as ai_router
from app.modules.shop.routers.shop_router import router as shop_router
from app.modules.messaging.routers.messaging import router as messaging_router

# ─── V1 aggregator ────────────────────────────────────────────────────────────
api_v1_router = APIRouter()

# ── Foundation endpoints ───────────────────────────────────────────────────────
api_v1_router.include_router(health_router)

# ── Phase B2 (Auth & Identity) ─────────────────────────────────────────────────
api_v1_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_v1_router.include_router(oauth_router, prefix="/auth", tags=["Auth - OAuth"])

# ── Phase B3 (User Account Management) ─────────────────────────────────────────
api_v1_router.include_router(users_router, prefix="/users", tags=["Users"])

# ── Phase B4 (Pet Management) ───────────────────────────────────────────────────
api_v1_router.include_router(pets_router, prefix="/pets", tags=["Pets"])

# ── Phase B5 (Health Domain) ───────────────────────────────────────────────────
api_v1_router.include_router(health_module_router, prefix="/pets/{pet_id}/health")

# ── Phase B6 (Dashboard Aggregation) ───────────────────────────────────────────
api_v1_router.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])

# ── Phase B7 (AI Engine) ───────────────────────────────────────────────────────
api_v1_router.include_router(ai_router, prefix="/ai", tags=["AI"])

# ── Phase B8 (Commerce Engine) ─────────────────────────────────────────────────
api_v1_router.include_router(shop_router, prefix="/shop", tags=["Shop"])

# ── Phase B9 (Community Domain) ────────────────────────────────────────────────
from app.modules.community.routers import community_router, adoption_router, lost_pet_router
api_v1_router.include_router(community_router)
api_v1_router.include_router(adoption_router)
api_v1_router.include_router(lost_pet_router)

# ── Phase B10 (Notification & Automation Engine) ───────────────────────────────
from app.modules.notifications.routers import notif_router, pref_router, rem_router
api_v1_router.include_router(notif_router)
api_v1_router.include_router(pref_router)
api_v1_router.include_router(messaging_router)
api_v1_router.include_router(rem_router)
