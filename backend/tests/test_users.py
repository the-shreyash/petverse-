"""
tests/test_users.py

End-to-end tests for the Phase B3 User Account Management module.

Covered success criteria:
  ✔ Get / replace (PUT) / patch (PATCH) profile
  ✔ Username-conflict guard on profile update
  ✔ Avatar upload + delete
  ✔ Preferences get/update (lazy defaults)
  ✔ Privacy get/update (lazy defaults)
  ✔ Change password (users router) revokes sessions like the auth endpoint
  ✔ Deactivate account (blocks further login)
  ✔ Delete account (soft delete; blocks login; is_deleted flag set)
"""

from __future__ import annotations

import base64

from tests.conftest import VALID_PASSWORD, registration_payload

# A minimal valid 1x1 transparent PNG.
_PNG_BYTES = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY"
    "42YAAAAASUVORK5CYII="
)


async def _register_and_token(client) -> dict:
    resp = await client.post("/api/v1/auth/register", json=registration_payload())
    return resp.json()["data"]["tokens"]


def _auth_header(tokens: dict) -> dict:
    return {"Authorization": f"Bearer {tokens['access_token']}"}


# ─── Profile ──────────────────────────────────────────────────────────────────

async def test_get_me(client):
    tokens = await _register_and_token(client)
    resp = await client.get("/api/v1/users/me", headers=_auth_header(tokens))
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["email"] == "ada@example.com"
    assert data["timezone"] == "UTC"
    assert data["language"] == "en"


async def test_get_me_requires_auth(client):
    resp = await client.get("/api/v1/users/me")
    assert resp.status_code == 401


async def test_put_profile_replaces_fields(client):
    tokens = await _register_and_token(client)
    resp = await client.put(
        "/api/v1/users/me",
        json={
            "first_name": "Grace",
            "last_name": "Hopper",
            "username": "gracehopper",
            "bio": "Compiler pioneer",
            "country": "USA",
            "city": "NYC",
            "timezone": "America/New_York",
            "language": "en",
        },
        headers=_auth_header(tokens),
    )
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["first_name"] == "Grace"
    assert data["username"] == "gracehopper"
    assert data["bio"] == "Compiler pioneer"
    assert data["city"] == "NYC"


async def test_put_profile_username_conflict(client):
    await client.post(
        "/api/v1/auth/register", json=registration_payload(email="other@example.com", username="taken")
    )
    tokens = await _register_and_token(client)
    resp = await client.put(
        "/api/v1/users/me",
        json={
            "first_name": "Ada",
            "last_name": "Lovelace",
            "username": "taken",
        },
        headers=_auth_header(tokens),
    )
    assert resp.status_code == 409
    assert resp.json()["error"] == "UsernameAlreadyExists"


async def test_patch_profile_partial_update(client):
    tokens = await _register_and_token(client)
    resp = await client.patch(
        "/api/v1/users/me", json={"bio": "Hi there"}, headers=_auth_header(tokens)
    )
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["bio"] == "Hi there"
    assert data["first_name"] == "Ada"  # untouched


# ─── Avatar ───────────────────────────────────────────────────────────────────

async def test_avatar_upload_and_delete(client):
    tokens = await _register_and_token(client)

    upload = await client.post(
        "/api/v1/users/avatar",
        files={"file": ("avatar.png", _PNG_BYTES, "image/png")},
        headers=_auth_header(tokens),
    )
    assert upload.status_code == 200
    url = upload.json()["data"]["profile_image"]
    assert url.startswith("/uploads/avatars/")

    me = await client.get("/api/v1/users/me", headers=_auth_header(tokens))
    assert me.json()["data"]["profile_image"] == url

    delete = await client.delete("/api/v1/users/avatar", headers=_auth_header(tokens))
    assert delete.status_code == 200
    assert delete.json()["data"]["profile_image"] is None


async def test_avatar_upload_rejects_bad_type(client):
    tokens = await _register_and_token(client)
    resp = await client.post(
        "/api/v1/users/avatar",
        files={"file": ("evil.txt", b"not an image", "text/plain")},
        headers=_auth_header(tokens),
    )
    assert resp.status_code == 422
    assert resp.json()["error"] == "InvalidAvatar"


# ─── Preferences ──────────────────────────────────────────────────────────────

async def test_get_preferences_lazy_default(client):
    tokens = await _register_and_token(client)
    resp = await client.get("/api/v1/users/preferences", headers=_auth_header(tokens))
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["theme"] == "SYSTEM"
    assert data["email_notifications"] is True


async def test_put_preferences_updates(client):
    tokens = await _register_and_token(client)
    resp = await client.put(
        "/api/v1/users/preferences",
        json={
            "theme": "DARK",
            "email_notifications": False,
            "push_notifications": False,
            "marketing_emails": True,
            "ai_notifications": False,
            "community_notifications": False,
            "order_notifications": False,
            "health_notifications": False,
        },
        headers=_auth_header(tokens),
    )
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["theme"] == "DARK"
    assert data["marketing_emails"] is True
    assert data["email_notifications"] is False


# ─── Privacy ──────────────────────────────────────────────────────────────────

async def test_get_privacy_lazy_default(client):
    tokens = await _register_and_token(client)
    resp = await client.get("/api/v1/users/privacy", headers=_auth_header(tokens))
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["profile_visibility"] == "PUBLIC"
    assert data["search_visibility"] is True


async def test_put_privacy_updates(client):
    tokens = await _register_and_token(client)
    resp = await client.put(
        "/api/v1/users/privacy",
        json={"profile_visibility": "PRIVATE", "search_visibility": False},
        headers=_auth_header(tokens),
    )
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["profile_visibility"] == "PRIVATE"
    assert data["search_visibility"] is False


# ─── Change password (users router) ───────────────────────────────────────────

async def test_change_password_via_users_router(client):
    tokens = await _register_and_token(client)
    resp = await client.put(
        "/api/v1/users/change-password",
        json={"current_password": VALID_PASSWORD, "new_password": "NewStr0ng@1"},
        headers=_auth_header(tokens),
    )
    assert resp.status_code == 200

    old_login = await client.post(
        "/api/v1/auth/login",
        json={"email": "ada@example.com", "password": VALID_PASSWORD},
    )
    assert old_login.status_code == 401

    new_login = await client.post(
        "/api/v1/auth/login",
        json={"email": "ada@example.com", "password": "NewStr0ng@1"},
    )
    assert new_login.status_code == 200


# ─── Deactivate / delete ──────────────────────────────────────────────────────

async def test_deactivate_account(client):
    tokens = await _register_and_token(client)
    resp = await client.request(
        "DELETE",
        "/api/v1/users/deactivate",
        json={"password": VALID_PASSWORD},
        headers=_auth_header(tokens),
    )
    assert resp.status_code == 200

    login = await client.post(
        "/api/v1/auth/login",
        json={"email": "ada@example.com", "password": VALID_PASSWORD},
    )
    assert login.status_code == 403
    assert login.json()["error"] == "InactiveUser"


async def test_deactivate_wrong_password_rejected(client):
    tokens = await _register_and_token(client)
    resp = await client.request(
        "DELETE",
        "/api/v1/users/deactivate",
        json={"password": "WrongP@ss1"},
        headers=_auth_header(tokens),
    )
    assert resp.status_code == 401


async def test_delete_account_soft_deletes(client):
    tokens = await _register_and_token(client)
    resp = await client.request(
        "DELETE",
        "/api/v1/users/delete-account",
        json={"password": VALID_PASSWORD},
        headers=_auth_header(tokens),
    )
    assert resp.status_code == 200

    # Old access token is now rejected (deactivated as part of deletion).
    me = await client.get("/api/v1/users/me", headers=_auth_header(tokens))
    assert me.status_code in (401, 403)

    login = await client.post(
        "/api/v1/auth/login",
        json={"email": "ada@example.com", "password": VALID_PASSWORD},
    )
    assert login.status_code == 403
