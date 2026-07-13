"""
app/utils/security.py

Primitives for opaque (non-JWT) tokens: cryptographically secure generation and
one-way hashing.

Used for refresh tokens and email-verification / password-reset tokens. The raw
value is handed to the client (or emailed); only its SHA-256 hash is stored, so
a database leak yields nothing usable — the same defence-in-depth we apply to
passwords.

SHA-256 (not bcrypt) is correct here because these tokens are already
high-entropy random values, so they are not brute-forceable and don't need a
slow salted hash. A fast hash also keeps the auth hot-path cheap.
"""

from __future__ import annotations

import hashlib
import secrets


def generate_secure_token(num_bytes: int = 48) -> str:
    """Return a URL-safe, high-entropy random token string."""
    return secrets.token_urlsafe(num_bytes)


def hash_token(raw_token: str) -> str:
    """Return the SHA-256 hex digest of a token for storage/lookup."""
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
