"""
app/middleware/response_time.py

Response time header middleware.

Adds X-Process-Time header (in milliseconds) to every response.
Useful for:
  - Frontend performance monitoring
  - API gateway metrics
  - Load testing analysis
"""

from __future__ import annotations

import time

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class ResponseTimeMiddleware(BaseHTTPMiddleware):
    """Attach X-Process-Time (ms) header to every response."""

    async def dispatch(self, request: Request, call_next) -> Response:
        start = time.perf_counter()
        response: Response = await call_next(request)
        duration_ms = (time.perf_counter() - start) * 1000
        response.headers["X-Process-Time"] = f"{duration_ms:.2f}ms"
        return response
