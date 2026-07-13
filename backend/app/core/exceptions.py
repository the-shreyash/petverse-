"""
app/core/exceptions.py

Global exception handlers registered on the FastAPI application.

All handlers return a consistent JSON envelope:
{
    "success": false,
    "error":   "<ErrorCode>",
    "message": "<human-readable description>",
    "request_id": "<UUID | null>"
}

This contract must never change so that frontend clients can rely on it.
"""

from __future__ import annotations

import traceback
from typing import Any

from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.logging import get_logger, request_id_ctx

logger = get_logger(__name__)


# ─── Response Builder ─────────────────────────────────────────────────────────

def _error_response(
    status_code: int,
    error: str,
    message: str,
    details: Any = None,
    request_id: str | None = None,
) -> JSONResponse:
    """Build a standardised error JSON response."""
    body: dict[str, Any] = {
        "success": False,
        "error": error,
        "message": message,
        "request_id": request_id or request_id_ctx.get(None),
    }
    if details is not None:
        body["details"] = details
    return JSONResponse(status_code=status_code, content=body)


# ─── Handlers ─────────────────────────────────────────────────────────────────

async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    """Handle FastAPI / Starlette HTTP exceptions (e.g. 404, 403, 401)."""
    # PetVerseException subclasses carry a machine-readable ``error_code`` (e.g.
    # "EmailAlreadyExists"). Plain Starlette/FastAPI HTTPExceptions don't, so we
    # fall back to a generic "HttpException" for those.
    error_code = getattr(exc, "error_code", "HttpException")
    logger.warning(
        "HTTPException | status=%d | error=%s | path=%s | detail=%s",
        exc.status_code,
        error_code,
        request.url.path,
        exc.detail,
    )
    return _error_response(
        status_code=exc.status_code,
        error=error_code,
        message=str(exc.detail),
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """
    Handle Pydantic validation errors on request bodies / query params.

    Flattens the error list into a human-readable structure while
    preserving the field paths for frontend consumption.
    """
    errors = []
    for err in exc.errors():
        field_path = " → ".join(str(loc) for loc in err["loc"])
        errors.append(
            {
                "field": field_path,
                "message": err["msg"],
                "type": err["type"],
            }
        )

    logger.warning(
        "ValidationError | path=%s | errors=%d",
        request.url.path,
        len(errors),
    )
    return _error_response(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        error="ValidationError",
        message="Request validation failed. Check the 'details' field for specifics.",
        details=errors,
    )


async def database_exception_handler(
    request: Request, exc: SQLAlchemyError
) -> JSONResponse:
    """Handle SQLAlchemy database errors without leaking internals."""
    logger.error(
        "DatabaseError | path=%s | error=%s",
        request.url.path,
        str(exc),
        exc_info=True,
    )
    return _error_response(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        error="DatabaseError",
        message="A database error occurred. Please try again later.",
    )


async def unhandled_exception_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    """
    Catch-all for any unhandled exception.

    Logs the full traceback server-side but returns a generic message
    to the client — never leak stack traces in production.
    """
    logger.critical(
        "UnhandledException | path=%s | type=%s | error=%s\n%s",
        request.url.path,
        type(exc).__name__,
        str(exc),
        traceback.format_exc(),
    )
    return _error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        error="InternalServerError",
        message="An unexpected error occurred. Our team has been notified.",
    )


def register_exception_handlers(app: Any) -> None:
    """Register all exception handlers on the FastAPI app instance."""
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(SQLAlchemyError, database_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
