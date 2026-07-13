"""
app/services/password_service.py

Business-facing wrapper around the password primitives in ``app/utils/password``.

Kept as a class so it can be dependency-injected and mocked in tests, and so any
future policy (breach checks, history, per-role rules) has an obvious home
without touching call sites.
"""

from __future__ import annotations

from app.exceptions.auth import WeakPasswordException
from app.utils import password as password_utils


class PasswordService:
    """Hashing, verification, and policy enforcement for passwords."""

    @staticmethod
    def hash(plain_password: str) -> str:
        return password_utils.hash_password(plain_password)

    @staticmethod
    def verify(plain_password: str, hashed_password: str) -> bool:
        return password_utils.verify_password(plain_password, hashed_password)

    @staticmethod
    def needs_rehash(hashed_password: str) -> bool:
        return password_utils.needs_rehash(hashed_password)

    @staticmethod
    def validate(plain_password: str) -> None:
        """
        Enforce the strength policy, raising the domain ``WeakPasswordException``
        (422) so it flows through the global error handler. Schemas validate too;
        this is the service-layer safety net for any non-HTTP caller.
        """
        try:
            password_utils.validate_password_strength(plain_password)
        except password_utils.PasswordPolicyError as exc:
            raise WeakPasswordException(str(exc)) from exc
