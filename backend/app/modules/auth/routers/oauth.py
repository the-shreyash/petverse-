"""
app/modules/auth/routers/oauth.py

Google OAuth 2.0 Authorization Code Flow.
Supports new account creation and linking to existing accounts by email.
"""

from __future__ import annotations

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse, RedirectResponse

from app.core.config import get_settings
from app.dependencies.auth import get_auth_service
from app.modules.auth.services.auth_service import AuthService
from app.modules.user.schemas.user import UserResponse
from app.modules.auth.schemas.auth import AuthResponse
from app.utils.response import success_response

router = APIRouter()


GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


@router.get("/google/login", summary="Initiate Google OAuth login")
async def google_login():
    """Redirect user to Google's OAuth 2.0 authorization page."""
    settings = get_settings()
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth is not configured. Set GOOGLE_CLIENT_ID in environment."
        )

    params = {
        "response_type": "code",
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account"
    }

    param_str = "&".join(f"{k}={v}" for k, v in params.items())
    return RedirectResponse(url=f"{GOOGLE_AUTH_URL}?{param_str}")


@router.get("/google/callback", summary="Google OAuth callback")
async def google_callback(
    code: str,
    auth: AuthService = Depends(get_auth_service),
):
    """Handle Google OAuth callback and issue JWT tokens."""
    settings = get_settings()
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth is not configured."
        )

    # Exchange code for tokens
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code"
            }
        )

    if token_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to exchange authorization code with Google."
        )

    token_data = token_response.json()
    google_access_token = token_data.get("access_token")

    if not google_access_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No access token received from Google."
        )

    # Fetch user info from Google
    async with httpx.AsyncClient() as client:
        userinfo_response = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {google_access_token}"}
        )

    if userinfo_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to fetch user info from Google."
        )

    google_user = userinfo_response.json()
    google_id = google_user.get("sub")
    email = google_user.get("email")
    given_name = google_user.get("given_name", "")
    family_name = google_user.get("family_name", "")
    picture = google_user.get("picture", "")
    email_verified = google_user.get("email_verified", False)

    if not email or not google_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google did not provide a valid email or user ID."
        )

    # Delegate to auth service for upsert + token generation
    user, tokens = await auth.login_or_register_with_google(
        google_id=google_id,
        email=email,
        first_name=given_name,
        last_name=family_name,
        profile_image=picture,
        email_verified=email_verified
    )

    # Redirect to frontend with tokens in URL fragment (SPA friendly)
    frontend_url = settings.FRONTEND_URL
    redirect_url = (
        f"{frontend_url}/auth/oauth-callback"
        f"?access_token={tokens.access_token}"
        f"&refresh_token={tokens.refresh_token}"
        f"&token_type={tokens.token_type}"
    )
    return RedirectResponse(url=redirect_url, status_code=status.HTTP_302_FOUND)


@router.post("/google/token", summary="Exchange Google ID token directly (mobile)")
async def google_token_exchange(
    id_token: str,
    auth: AuthService = Depends(get_auth_service),
):
    """For mobile clients that already have a Google ID token."""
    # Verify ID token with Google
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Google ID token."
        )

    payload = response.json()
    settings = get_settings()

    # Validate audience
    if payload.get("aud") != settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID token audience mismatch."
        )

    user, tokens = await auth.login_or_register_with_google(
        google_id=payload.get("sub"),
        email=payload.get("email"),
        first_name=payload.get("given_name", ""),
        last_name=payload.get("family_name", ""),
        profile_image=payload.get("picture", ""),
        email_verified=payload.get("email_verified", False)
    )

    body = AuthResponse(user=UserResponse.model_validate(user), tokens=tokens)
    return success_response(data=body.model_dump(mode="json"), message="Google authentication successful.")
