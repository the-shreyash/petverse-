"""
app/utils/password.py

Low-level password hashing, verification, and strength validation.

Implemented in Phase B2. The public function signatures are unchanged from the
Phase B1 placeholder so existing imports keep working.

Implementation notes:
  - Hashing uses passlib's bcrypt backend with a configurable cost factor
    (``BCRYPT_ROUNDS``, default 12). bcrypt automatically salts every hash.
  - ``verify_password`` is constant-time (bcrypt compares the full digest) and
    never raises on a malformed hash — it returns ``False`` so a corrupt row
    can't crash the login path.
  - bcrypt silently truncates input beyond 72 bytes, so ``validate_password_strength``
    rejects anything longer to avoid a surprising "any suffix works" behaviour.

The ``PasswordService`` in ``app/services`` is the layer business code should
call; these functions are the primitives it wraps.
"""

from __future__ import annotations

import re

from passlib.context import CryptContext

from app.core.config import get_settings

# bcrypt's hard limit — passwords are truncated beyond this many bytes.
BCRYPT_MAX_BYTES = 72

MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_LENGTH = 72

_settings = get_settings()

# A single shared context. ``deprecated="auto"`` lets us add stronger schemes
# later and have passlib flag old hashes for rehashing on next login.
_pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=_settings.BCRYPT_ROUNDS,
)


class PasswordPolicyError(ValueError):
    """Raised when a candidate password fails the strength policy."""


def hash_password(plain_password: str) -> str:
    """Hash a plain-text password with bcrypt (auto-salted)."""
    return _pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain-text password against a stored hash.

    Returns ``False`` (never raises) if the stored hash is missing or malformed,
    so authentication logic can treat every failure uniformly.
    """
    if not hashed_password:
        return False
    try:
        return _pwd_context.verify(plain_password, hashed_password)
    except (ValueError, TypeError):
        return False


def needs_rehash(hashed_password: str) -> bool:
    """True if the hash was made with outdated parameters and should be upgraded."""
    return _pwd_context.needs_update(hashed_password)


def validate_password_strength(password: str) -> None:
    """
    Enforce the password policy. Raises ``PasswordPolicyError`` on the first
    violation with a human-readable message.

    Policy: 8–72 chars, at least one uppercase, one lowercase, one digit, and
    one special character.
    """
    if len(password) < MIN_PASSWORD_LENGTH:
        raise PasswordPolicyError(
            f"Password must be at least {MIN_PASSWORD_LENGTH} characters long."
        )
    if len(password.encode("utf-8")) > BCRYPT_MAX_BYTES:
        raise PasswordPolicyError(
            f"Password must not exceed {MAX_PASSWORD_LENGTH} characters."
        )
    if not re.search(r"[A-Z]", password):
        raise PasswordPolicyError("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        raise PasswordPolicyError("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", password):
        raise PasswordPolicyError("Password must contain at least one number.")
    if not re.search(r"[^A-Za-z0-9]", password):
        raise PasswordPolicyError(
            "Password must contain at least one special character."
        )
