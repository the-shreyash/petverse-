"""
app/services/email_service.py

Transactional email — PLACEHOLDER (Phase B2).

No SMTP/provider is wired up yet. Each method logs the message it *would* send
(including the action link) so the whole verification / reset flow is fully
exercisable in development: grab the link from the logs and hit the endpoint.

The public interface is final. Phase B-later will swap the log calls for a real
provider (SES / SendGrid / Resend) — nothing that calls this service will change.
"""

from __future__ import annotations

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class EmailService:
    """Sends account-related emails. Currently logs instead of sending."""

    def __init__(self) -> None:
        self.settings = get_settings()

    def _link(self, path: str, token: str) -> str:
        base = self.settings.FRONTEND_URL.rstrip("/")
        return f"{base}/{path.lstrip('/')}?token={token}"

    async def send_verification_email(self, *, email: str, token: str) -> None:
        link = self._link("verify-email", token)
        logger.info(
            "[EMAIL:PLACEHOLDER] Verification email → %s | link=%s", email, link
        )

    async def send_reset_password_email(self, *, email: str, token: str) -> None:
        link = self._link("reset-password", token)
        logger.info(
            "[EMAIL:PLACEHOLDER] Password-reset email → %s | link=%s", email, link
        )

    async def send_welcome_email(self, *, email: str, first_name: str) -> None:
        logger.info(
            "[EMAIL:PLACEHOLDER] Welcome email → %s | name=%s", email, first_name
        )
