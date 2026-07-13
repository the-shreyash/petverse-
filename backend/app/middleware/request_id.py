"""
app/middleware/request_id.py

Request ID middleware.

Assigns a unique X-Request-ID to every request:
  - Uses the incoming header value if already present (upstream proxy/gateway)
  - Generates a new UUID4 if absent

The ID is stored in a ContextVar so the logging system can inject it
into every log line without threading concerns.
"""

from __future__ import annotations

import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.logging import request_id_ctx

REQUEST_ID_HEADER = "X-Request-ID"


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Attach a unique request ID to every request and response."""

    async def dispatch(self, request: Request, call_next) -> Response:
        # Honour upstream request IDs (e.g. from API Gateway / load balancer)
        request_id = request.headers.get(REQUEST_ID_HEADER) or str(uuid.uuid4())

        # Store in context variable for logging and error responses
        token = request_id_ctx.set(request_id)

        try:
            response: Response = await call_next(request)
            response.headers[REQUEST_ID_HEADER] = request_id
            return response
        finally:
            # Always reset the context variable, even on error
            request_id_ctx.reset(token)
