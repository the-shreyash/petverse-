"""
app/dependencies/auth.py

The shared authentication & authorization dependencies.

⭐ This module is the single source of truth for "who is calling?". EVERY
protected route in EVERY future module (Pets, Health, Shop, Community,
Notifications, Admin) must depend on ``get_current_user`` (or one of the derived
dependencies) rather than re-implementing token parsing. Authentication logic
lives here and nowhere else.

Dependency ladder (each builds on the previous):
    get_current_user        → valid access token + active account  → User
    get_verified_user       → the above AND email verified         → User
    require_roles(*roles)    → the above AND role in {roles}         → User
    get_admin_user          → require_roles(ADMIN)                  → User
    get_optional_user       → User or None (never raises)           → Optional[User]

We use ``HTTPBearer`` so the token is read from the ``Authorization: Bearer ...``
header — the correct transport for a token-based API and what Swagger's
"Authorize" button drives.
"""

from __future__ import annotations

from typing import Callable, Optional

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.common import get_db
from app.exceptions.auth import (
    InactiveUserException,
    InvalidTokenException,
    UnverifiedUserException,
)
from app.exceptions.http import ForbiddenException
from app.database.enums import UserRole
from app.modules.user.models.user import User
from app.modules.user.repositories.user_repository import UserRepository
from app.modules.auth.services.auth_service import AuthService
from app.modules.auth.services.token_service import TokenService

# ``auto_error=False`` so WE decide the error shape (our standard envelope)
# instead of Starlette's default 403 for a missing header.
_bearer_scheme = HTTPBearer(auto_error=False, description="JWT access token")


# ─── Service provider ─────────────────────────────────────────────────────────

def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    """Provide an ``AuthService`` bound to the request's DB session."""
    return AuthService(db)


# ─── Core: authenticated user ─────────────────────────────────────────────────

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Resolve and return the ``User`` for a valid access token.

    Raises:
        InvalidTokenException / ExpiredTokenException — bad, wrong-type, or
            expired token (401).
        InactiveUserException — the account has been deactivated (403).

    This is THE dependency every protected route reuses.
    """
    if credentials is None or not credentials.credentials:
        raise InvalidTokenException("Authentication credentials were not provided.")

    token_service = TokenService(db)
    payload = token_service.decode_access_token(credentials.credentials)

    user = await UserRepository(db).get_by_id(payload["sub"])
    if user is None or user.is_deleted:
        raise InvalidTokenException("Account no longer exists.")
    if not user.is_active:
        raise InactiveUserException()

    return user


# ─── Verified user ────────────────────────────────────────────────────────────

async def get_verified_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Require that the authenticated user has verified their email (403 if not)."""
    if not current_user.is_verified:
        raise UnverifiedUserException()
    return current_user


# ─── Role-based authorization ─────────────────────────────────────────────────

class RoleChecker:
    """
    Reusable role gate. Instantiate with the roles allowed on a route:

        require_admin = RoleChecker([UserRole.ADMIN])

        @router.get("/admin", dependencies=[Depends(require_admin)])
        async def admin_only(): ...

    or bind the user:

        @router.get("/vets")
        async def vets(user: User = Depends(RoleChecker([UserRole.VETERINARIAN]))):
    """

    def __init__(self, allowed_roles: list[UserRole]):
        self.allowed_roles = allowed_roles

    async def __call__(
        self, current_user: User = Depends(get_current_user)
    ) -> User:
        if current_user.role not in self.allowed_roles:
            raise ForbiddenException(
                "You do not have the required role to perform this action."
            )
        return current_user


def require_roles(*roles: UserRole) -> Callable:
    """Convenience factory: ``Depends(require_roles(UserRole.ADMIN, UserRole.SHELTER))``."""
    return RoleChecker(list(roles))


# Ready-made gate for admin-only routes.
get_admin_user = RoleChecker([UserRole.ADMIN])


# ─── Optional authentication ──────────────────────────────────────────────────

async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """
    Return the user if a valid token is present, otherwise ``None``.

    For endpoints that are public but behave differently for signed-in users.
    Never raises on missing/invalid credentials — it simply yields ``None``.
    """
    if credentials is None or not credentials.credentials:
        return None
    try:
        user = await UserRepository(db).get_by_id(
            TokenService(db).decode_access_token(credentials.credentials)["sub"]
        )
    except Exception:
        return None
    if user is None or not user.is_active or user.is_deleted:
        return None
    return user
