"""
app/dependencies/common.py

Reusable FastAPI dependencies shared across all routers.

Injected via Depends() in route function signatures.

Current dependencies:
  - get_db         → yields AsyncSession (database connection)
  - get_settings   → returns cached Settings instance

Authentication dependencies (get_current_user, get_verified_user,
get_admin_user, require_roles, get_optional_user) now live in
``app/dependencies/auth.py`` and are re-exported at the bottom of this module so
existing ``from app.dependencies.common import get_current_user`` imports keep
working. Prefer importing them from ``app.dependencies.auth`` in new code.
"""

from __future__ import annotations

from typing import AsyncGenerator

from app.core.config import Settings, get_settings
from app.database.engine import get_db as _get_db
from sqlalchemy.ext.asyncio import AsyncSession


# ─── Database Dependency ──────────────────────────────────────────────────────

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Yield an async database session for the duration of the request.

    Commits on success, rolls back on any exception.

    Usage:
        @router.get("/items")
        async def list_items(db: AsyncSession = Depends(get_db)):
            ...
    """
    async for session in _get_db():
        yield session


# ─── Settings Dependency ──────────────────────────────────────────────────────

def get_settings_dep() -> Settings:
    """
    Return the application settings singleton.

    Usage:
        @router.get("/info")
        async def app_info(settings: Settings = Depends(get_settings_dep)):
            ...
    """
    return get_settings()


# ─── Auth dependencies (re-exported from app.dependencies.auth) ───────────────
# Implemented in Phase B2 and defined in ``app/dependencies/auth.py``. They are
# re-exported here — LAZILY, via module ``__getattr__`` — so the historical
# import path ``from app.dependencies.common import get_current_user`` keeps
# working WITHOUT a circular import (auth.py imports ``get_db`` from this module
# at load time, so we must not import auth.py at load time in return).

_AUTH_REEXPORTS = frozenset(
    {
        "get_auth_service",
        "get_current_user",
        "get_verified_user",
        "get_admin_user",
        "get_optional_user",
        "require_roles",
        "RoleChecker",
    }
)

__all__ = ["get_db", "get_settings_dep", *sorted(_AUTH_REEXPORTS)]


def __getattr__(name: str):
    """Resolve auth dependency names on first access (PEP 562)."""
    if name in _AUTH_REEXPORTS:
        from app.dependencies import auth

        return getattr(auth, name)
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
