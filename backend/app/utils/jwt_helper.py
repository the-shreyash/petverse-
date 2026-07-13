"""
app/utils/jwt_helper.py

Low-level JWT encode/decode primitives, implemented in Phase B2 with
python-jose.

This module knows nothing about users or the database — it only turns a claims
dict into a signed string and back. The typed, business-aware layer lives in
``app/services/token_service.py``.

Token design:
  - HS256 symmetric signing with ``JWT_SECRET`` from settings.
  - Every token carries a ``type`` claim ("access" or "refresh") so an access
    token can never be used where a refresh token is required, and vice-versa.
  - Standard registered claims: ``sub`` (user id), ``exp``, ``iat``, and ``jti``
    (a unique id enabling refresh-token revocation lookups).
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Optional

from jose import JWTError, jwt

from app.core.config import get_settings
from app.utils.datetime_helper import utcnow
from app.utils.uuid_helper import generate_uuid

# ─── Token type constants ─────────────────────────────────────────────────────
ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"


class TokenDecodeError(Exception):
    """Raised when a token is malformed, tampered with, or expired."""

    def __init__(self, message: str, expired: bool = False):
        super().__init__(message)
        self.expired = expired


def _encode(claims: dict[str, Any]) -> str:
    settings = get_settings()
    return jwt.encode(claims, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_token(
    subject: str,
    token_type: str,
    expires_delta: timedelta,
    extra_claims: Optional[dict[str, Any]] = None,
) -> tuple[str, str, datetime]:
    """
    Build and sign a JWT.

    Returns a ``(token, jti, expires_at)`` tuple. The ``jti`` and ``expires_at``
    are surfaced so the caller (TokenService) can persist a refresh token record
    without having to decode what it just created.
    """
    now = utcnow()
    expires_at = now + expires_delta
    jti = generate_uuid()

    claims: dict[str, Any] = {
        "sub": str(subject),
        "type": token_type,
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
        "jti": jti,
    }
    if extra_claims:
        # Never let extra claims clobber the security-critical registered ones.
        for reserved in ("sub", "type", "iat", "exp", "jti"):
            extra_claims.pop(reserved, None)
        claims.update(extra_claims)

    return _encode(claims), jti, expires_at


def decode_token(token: str) -> dict[str, Any]:
    """
    Decode and verify a JWT's signature and expiry.

    Raises ``TokenDecodeError`` (with ``expired=True`` when the failure is an
    expiry) instead of leaking jose's internals. The signature and ``exp`` are
    always validated by ``jwt.decode``.
    """
    settings = get_settings()
    try:
        return jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except jwt.ExpiredSignatureError as exc:
        raise TokenDecodeError("Token has expired.", expired=True) from exc
    except JWTError as exc:
        raise TokenDecodeError("Token is invalid.") from exc
