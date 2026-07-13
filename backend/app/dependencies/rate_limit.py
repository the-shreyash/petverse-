"""
app/dependencies/rate_limit.py

Rate-limiting — PLACEHOLDER (Phase B2).

Brute-forcing login / forgot-password / resend-verification is the classic
attack on an auth API, so those routes declare a rate-limit dependency NOW. The
current implementation is a no-op stub with the final call signature; wiring a
real limiter (Redis fixed-window / token-bucket, or slowapi) later requires no
change at any call site.

Usage on a route:
    @router.post("/login", dependencies=[Depends(RateLimiter("login", times=5, seconds=60))])

NOTE: this module intentionally does NOT use ``from __future__ import annotations``.
FastAPI special-cases a parameter annotated ``Request`` to inject the live
request, but that relies on the annotation being the real class — stringized
(PEP 563) annotations defeat the check and FastAPI would treat ``request`` as a
query parameter instead.
"""

from fastapi import Request

from app.core.logging import get_logger

logger = get_logger(__name__)


class RateLimiter:
    """
    Configurable rate-limit gate. Currently a no-op that documents intent.

    Args:
        scope:   A label for the limited action (used as part of the Redis key).
        times:   Max number of requests allowed within ``seconds``.
        seconds: The sliding/fixed window length.
    """

    def __init__(self, scope: str, *, times: int = 60, seconds: int = 60):
        self.scope = scope
        self.times = times
        self.seconds = seconds

    async def __call__(self, request: Request) -> None:
        # Phase B-later: build key from client IP + scope, INCR in Redis, and
        # raise a 429 TooManyRequests once the counter exceeds ``self.times``.
        # For now we only trace so the hook points are visible in development.
        logger.debug(
            "rate-limit (noop) | scope=%s | limit=%s/%ss | client=%s",
            self.scope,
            self.times,
            self.seconds,
            request.client.host if request.client else "unknown",
        )
        return None
