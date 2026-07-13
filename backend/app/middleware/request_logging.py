"""
app/middleware/request_logging.py

Structured request / response logging middleware.

Logs:
  - On request:  method, path, client IP
  - On response: method, path, status code, duration

Skips logging for health check endpoints to avoid log noise
in orchestration environments (Kubernetes liveness probes, etc.).
"""

from __future__ import annotations

import time

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.logging import get_logger

logger = get_logger("petverse.access")

# Paths excluded from access logging (reduces noise from health probes)
_SKIP_PATHS = frozenset({"/health", "/health/live", "/health/ready"})


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log every inbound request and its response."""

    async def dispatch(self, request: Request, call_next) -> Response:
        if request.url.path in _SKIP_PATHS:
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        start = time.perf_counter()

        logger.info(
            "→ %s %s | client=%s",
            request.method,
            request.url.path,
            client_ip,
        )

        try:
            response: Response = await call_next(request)
        except Exception as exc:
            duration_ms = (time.perf_counter() - start) * 1000
            logger.error(
                "✗ %s %s | duration=%.1fms | error=%s",
                request.method,
                request.url.path,
                duration_ms,
                str(exc),
            )
            raise

        duration_ms = (time.perf_counter() - start) * 1000
        status_code = response.status_code
        level = (
            logger.warning if status_code >= 400 else
            logger.info
        )
        level(
            "← %s %s | status=%d | duration=%.1fms",
            request.method,
            request.url.path,
            status_code,
            duration_ms,
        )

        return response
