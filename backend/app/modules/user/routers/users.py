"""
app/api/v1/routers/users.py

HTTP layer for the User Account Management module (Phase B3).

Every route depends on ``get_current_user`` — authentication is never
re-implemented here, only reused from ``app.dependencies.auth``. Routers stay
thin: validate input, call the relevant service, wrap the result in the
standard ``success_response`` envelope. No direct database access.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, File, UploadFile
from fastapi.responses import JSONResponse

from app.dependencies.auth import get_current_user
from app.dependencies.users import (
    get_avatar_service,
    get_preference_service,
    get_privacy_service,
    get_profile_service,
    get_user_service,
)
from app.modules.user.models.user import User
from app.modules.auth.schemas.auth import ChangePasswordRequest, MessageResponse
from app.modules.user.schemas.user import (
    AccountActionRequest,
    AvatarResponse,
    PreferencesResponse,
    PreferencesUpdateRequest,
    PrivacyResponse,
    PrivacyUpdateRequest,
    ProfileReplaceRequest,
    ProfileUpdateRequest,
    UserResponse,
)
from app.modules.user.services.avatar_service import AvatarService
from app.modules.user.services.preference_service import PreferenceService
from app.modules.user.services.privacy_service import PrivacyService
from app.modules.user.services.profile_service import ProfileService
from app.modules.user.services.user_service import UserService
from app.utils.response import success_response

router = APIRouter()


# ─── Current user / profile ───────────────────────────────────────────────────

@router.get("/me", summary="Get the current user's profile")
async def get_me(current_user: User = Depends(get_current_user)) -> JSONResponse:
    return success_response(
        data=UserResponse.model_validate(current_user).model_dump(mode="json"),
        message="Profile retrieved.",
    )


@router.put("/me", summary="Replace the current user's profile")
async def replace_me(
    payload: ProfileReplaceRequest,
    current_user: User = Depends(get_current_user),
    profiles: ProfileService = Depends(get_profile_service),
) -> JSONResponse:
    user = await profiles.replace_profile(current_user, payload)
    return success_response(
        data=UserResponse.model_validate(user).model_dump(mode="json"),
        message="Profile updated.",
    )


@router.patch("/me", summary="Partially update the current user's profile")
async def update_me(
    payload: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    profiles: ProfileService = Depends(get_profile_service),
) -> JSONResponse:
    user = await profiles.update_profile(current_user, payload)
    return success_response(
        data=UserResponse.model_validate(user).model_dump(mode="json"),
        message="Profile updated.",
    )


# ─── Avatar ───────────────────────────────────────────────────────────────────

@router.post("/avatar", summary="Upload a new profile avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    avatars: AvatarService = Depends(get_avatar_service),
) -> JSONResponse:
    user = await avatars.upload_avatar(current_user, file)
    return success_response(
        data=AvatarResponse.model_validate(user).model_dump(mode="json"),
        message="Avatar uploaded.",
    )


@router.delete("/avatar", summary="Delete the current profile avatar")
async def delete_avatar(
    current_user: User = Depends(get_current_user),
    avatars: AvatarService = Depends(get_avatar_service),
) -> JSONResponse:
    user = await avatars.delete_avatar(current_user)
    return success_response(
        data=AvatarResponse.model_validate(user).model_dump(mode="json"),
        message="Avatar deleted.",
    )


# ─── Password ─────────────────────────────────────────────────────────────────

@router.put("/change-password", summary="Change the current user's password")
async def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    users: UserService = Depends(get_user_service),
) -> JSONResponse:
    """Delegates to the same logic as ``POST /auth/change-password``."""
    await users.change_password(
        current_user, payload.current_password, payload.new_password
    )
    return success_response(
        data=MessageResponse(detail="Password changed successfully.").model_dump(),
        message="Password changed successfully.",
    )


# ─── Preferences ──────────────────────────────────────────────────────────────

@router.get("/preferences", summary="Get notification/theme preferences")
async def get_preferences(
    current_user: User = Depends(get_current_user),
    preferences: PreferenceService = Depends(get_preference_service),
) -> JSONResponse:
    prefs = await preferences.get_or_create(current_user.id)
    return success_response(
        data=PreferencesResponse.model_validate(prefs).model_dump(mode="json"),
        message="Preferences retrieved.",
    )


@router.put("/preferences", summary="Replace notification/theme preferences")
async def update_preferences(
    payload: PreferencesUpdateRequest,
    current_user: User = Depends(get_current_user),
    preferences: PreferenceService = Depends(get_preference_service),
) -> JSONResponse:
    prefs = await preferences.update(current_user.id, payload)
    return success_response(
        data=PreferencesResponse.model_validate(prefs).model_dump(mode="json"),
        message="Preferences updated.",
    )


# ─── Privacy ──────────────────────────────────────────────────────────────────

@router.get("/privacy", summary="Get profile visibility/search settings")
async def get_privacy(
    current_user: User = Depends(get_current_user),
    privacy: PrivacyService = Depends(get_privacy_service),
) -> JSONResponse:
    settings_ = await privacy.get_or_create(current_user.id)
    return success_response(
        data=PrivacyResponse.model_validate(settings_).model_dump(mode="json"),
        message="Privacy settings retrieved.",
    )


@router.put("/privacy", summary="Replace profile visibility/search settings")
async def update_privacy(
    payload: PrivacyUpdateRequest,
    current_user: User = Depends(get_current_user),
    privacy: PrivacyService = Depends(get_privacy_service),
) -> JSONResponse:
    settings_ = await privacy.update(current_user.id, payload)
    return success_response(
        data=PrivacyResponse.model_validate(settings_).model_dump(mode="json"),
        message="Privacy settings updated.",
    )


# ─── Account lifecycle ────────────────────────────────────────────────────────

@router.delete("/deactivate", summary="Deactivate the current account")
async def deactivate_account(
    payload: AccountActionRequest,
    current_user: User = Depends(get_current_user),
    users: UserService = Depends(get_user_service),
) -> JSONResponse:
    await users.deactivate_account(current_user, payload.password)
    return success_response(
        data=MessageResponse(detail="Account deactivated.").model_dump(),
        message="Account deactivated.",
    )


@router.delete("/delete-account", summary="Soft-delete the current account")
async def delete_account(
    payload: AccountActionRequest,
    current_user: User = Depends(get_current_user),
    users: UserService = Depends(get_user_service),
) -> JSONResponse:
    await users.delete_account(current_user, payload.password)
    return success_response(
        data=MessageResponse(detail="Account deleted.").model_dump(),
        message="Account deleted.",
    )
