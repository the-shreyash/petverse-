"""
app/api/v1/routers/auth.py

HTTP layer for the Identity module.

Routers are deliberately thin: validate input (Pydantic), call ``AuthService``,
wrap the result in the standard response envelope. No business logic, no direct
database access — that all lives in the service/repository layers.

Every response uses the shared ``success_response`` envelope from
``app/utils/response`` so the auth endpoints match the rest of the API. Error
paths raise domain exceptions that the global handlers render into the matching
error envelope.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from app.dependencies.auth import get_auth_service, get_current_user
from app.dependencies.rate_limit import RateLimiter
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    LogoutRequest,
    MessageResponse,
    RefreshRequest,
    RegisterRequest,
    ResendVerificationRequest,
    ResetPasswordRequest,
    TokenPair,
    VerifyEmailRequest,
)
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.utils.response import success_response

router = APIRouter()

# Generic message shown for reset/verification flows — never reveals whether an
# email is registered (anti-enumeration).
_NEUTRAL_EMAIL_MSG = (
    "If an account matching that email exists, we've sent the next step to it."
)


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Register a new account",
    dependencies=[Depends(RateLimiter("register", times=10, seconds=3600))],
)
async def register(
    payload: RegisterRequest,
    auth: AuthService = Depends(get_auth_service),
) -> JSONResponse:
    """Create a local account and return the user with an access/refresh pair."""
    user, tokens = await auth.register(payload)
    body = AuthResponse(user=UserResponse.model_validate(user), tokens=tokens)
    return success_response(
        data=body.model_dump(mode="json"),
        message="Registration successful. Please verify your email.",
        status_code=status.HTTP_201_CREATED,
    )


@router.post(
    "/login",
    summary="Log in with email and password",
    dependencies=[Depends(RateLimiter("login", times=5, seconds=60))],
)
async def login(
    payload: LoginRequest,
    auth: AuthService = Depends(get_auth_service),
) -> JSONResponse:
    """Authenticate and return the user with an access/refresh pair."""
    user, tokens = await auth.login(payload)
    body = AuthResponse(user=UserResponse.model_validate(user), tokens=tokens)
    return success_response(data=body.model_dump(mode="json"), message="Login successful.")


@router.post("/refresh", summary="Exchange a refresh token for a new token pair")
async def refresh(
    payload: RefreshRequest,
    auth: AuthService = Depends(get_auth_service),
) -> JSONResponse:
    """Rotate the refresh token (old one is revoked) and issue a fresh pair."""
    user, tokens = await auth.refresh(payload.refresh_token)
    body = AuthResponse(user=UserResponse.model_validate(user), tokens=tokens)
    return success_response(data=body.model_dump(mode="json"), message="Token refreshed.")


@router.post("/logout", summary="Revoke a refresh token")
async def logout(
    payload: LogoutRequest,
    auth: AuthService = Depends(get_auth_service),
    _current: User = Depends(get_current_user),
) -> JSONResponse:
    """Revoke the presented refresh token so it can no longer mint access tokens."""
    await auth.logout(payload.refresh_token)
    return success_response(
        data=MessageResponse(detail="Logged out successfully.").model_dump(),
        message="Logged out successfully.",
    )


@router.get("/me", summary="Get the current authenticated user")
async def me(current_user: User = Depends(get_current_user)) -> JSONResponse:
    """Return the profile of the user identified by the access token."""
    return success_response(
        data=UserResponse.model_validate(current_user).model_dump(mode="json"),
        message="Current user retrieved.",
    )


@router.post(
    "/forgot-password",
    summary="Request a password-reset link",
    dependencies=[Depends(RateLimiter("forgot_password", times=5, seconds=3600))],
)
async def forgot_password(
    payload: ForgotPasswordRequest,
    auth: AuthService = Depends(get_auth_service),
) -> JSONResponse:
    """Always returns a neutral message — never reveals whether the email exists."""
    await auth.forgot_password(payload.email)
    return success_response(
        data=MessageResponse(detail=_NEUTRAL_EMAIL_MSG).model_dump(),
        message=_NEUTRAL_EMAIL_MSG,
    )


@router.post("/reset-password", summary="Reset a password using a reset token")
async def reset_password(
    payload: ResetPasswordRequest,
    auth: AuthService = Depends(get_auth_service),
) -> JSONResponse:
    """Set a new password from a valid reset token and revoke all sessions."""
    await auth.reset_password(payload.token, payload.new_password)
    return success_response(
        data=MessageResponse(detail="Password reset successful.").model_dump(),
        message="Password reset successful. Please log in with your new password.",
    )


@router.post("/change-password", summary="Change password (authenticated)")
async def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    auth: AuthService = Depends(get_auth_service),
) -> JSONResponse:
    """Change the current user's password and revoke all other sessions."""
    await auth.change_password(
        current_user, payload.current_password, payload.new_password
    )
    return success_response(
        data=MessageResponse(detail="Password changed successfully.").model_dump(),
        message="Password changed successfully.",
    )


@router.post("/verify-email", summary="Verify an email address")
async def verify_email(
    payload: VerifyEmailRequest,
    auth: AuthService = Depends(get_auth_service),
) -> JSONResponse:
    """Mark the account verified using a verification token."""
    user = await auth.verify_email(payload.token)
    return success_response(
        data=UserResponse.model_validate(user).model_dump(mode="json"),
        message="Email verified successfully.",
    )


@router.post(
    "/resend-verification",
    summary="Resend the email-verification link",
    dependencies=[Depends(RateLimiter("resend_verification", times=5, seconds=3600))],
)
async def resend_verification(
    payload: ResendVerificationRequest,
    auth: AuthService = Depends(get_auth_service),
) -> JSONResponse:
    """Re-issue a verification email. Neutral response (no enumeration)."""
    await auth.resend_verification(payload.email)
    return success_response(
        data=MessageResponse(detail=_NEUTRAL_EMAIL_MSG).model_dump(),
        message=_NEUTRAL_EMAIL_MSG,
    )
