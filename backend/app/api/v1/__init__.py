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

from app.api.v1.routers.auth import router as auth_router
from app.api.v1.routers.health import router as health_router
from app.api.v1.routers.pets import router as pets_router
from app.api.v1.routers.users import router as users_router

# ─── V1 aggregator ────────────────────────────────────────────────────────────
api_v1_router = APIRouter()

# ── Foundation endpoints ───────────────────────────────────────────────────────
api_v1_router.include_router(health_router)

# ── Phase B2 (Auth & Identity) ─────────────────────────────────────────────────
api_v1_router.include_router(auth_router, prefix="/auth", tags=["Auth"])

# ── Phase B3 (User Account Management) ─────────────────────────────────────────
api_v1_router.include_router(users_router, prefix="/users", tags=["Users"])

# ── Phase B4 (Pet Management) ───────────────────────────────────────────────────
api_v1_router.include_router(pets_router, prefix="/pets", tags=["Pets"])
