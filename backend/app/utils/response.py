"""
app/utils/response.py

Standardised API response formatter.

All successful API responses must use these helpers to maintain a
consistent envelope across every endpoint in PetVerse.

Envelope contract:
{
    "success": true,
    "message": "<human-readable string>",
    "data":    <payload | null>,
    "meta":    <optional pagination / metadata>
}

Usage:
    from app.utils.response import success_response, paginated_response

    return success_response(data=user, message="User retrieved")
    return paginated_response(data=items, total=100, page=1, per_page=20)
"""

from __future__ import annotations

from typing import Any, Optional

from fastapi.responses import JSONResponse


def success_response(
    data: Any = None,
    message: str = "Success",
    status_code: int = 200,
    meta: Optional[dict] = None,
) -> JSONResponse:
    """
    Return a successful JSON response with a standard envelope.

    Args:
        data:        The response payload (any JSON-serialisable value).
        message:     Human-readable success message.
        status_code: HTTP status code (default 200).
        meta:        Optional metadata (pagination, etc.).
    """
    body: dict[str, Any] = {
        "success": True,
        "message": message,
        "data": data,
    }
    if meta is not None:
        body["meta"] = meta

    return JSONResponse(status_code=status_code, content=body)


def created_response(data: Any = None, message: str = "Created successfully") -> JSONResponse:
    """Shortcut for HTTP 201 Created responses."""
    return success_response(data=data, message=message, status_code=201)


def no_content_response() -> JSONResponse:
    """Shortcut for HTTP 204 No Content (returns empty body with 200 for consistency)."""
    return success_response(data=None, message="Deleted successfully", status_code=200)


def paginated_response(
    data: list,
    total: int,
    page: int,
    per_page: int,
    message: str = "Success",
) -> JSONResponse:
    """
    Return a paginated list response.

    Args:
        data:     The current page's items.
        total:    Total number of items across all pages.
        page:     Current page number (1-indexed).
        per_page: Number of items per page.
        message:  Human-readable message.
    """
    total_pages = max(1, -(-total // per_page))  # ceiling division
    meta = {
        "page": page,
        "per_page": per_page,
        "total": total,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1,
    }
    return success_response(data=data, message=message, meta=meta)
