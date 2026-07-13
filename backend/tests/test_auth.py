"""
tests/test_auth.py

End-to-end and unit tests for the Phase B2 Authentication module.

Covered success criteria:
  ✔ Registration (+ duplicate email/username, password strength)
  ✔ Login (+ wrong password, unknown email → same generic error)
  ✔ JWT access token / current user (/me) + auth guard
  ✔ Refresh (rotation: old token becomes invalid)
  ✔ Logout (refresh token revoked)
  ✔ Change password (+ session revocation)
  ✔ Forgot / reset password (token flow, neutral responses)
  ✔ Email verification + resend
  ✔ Password hashing & JWT primitives (unit)
"""

from __future__ import annotations

import pytest
import pytest_asyncio

from tests.conftest import VALID_PASSWORD, registration_payload


# ─── Email capture ────────────────────────────────────────────────────────────

@pytest_asyncio.fixture
async def captured_emails(monkeypatch):
    """
    Capture the raw tokens the (placeholder) EmailService would send, so tests
    can drive the verify-email / reset-password flows end to end.
    """
    store = {"verification": [], "reset": [], "welcome": []}

    from app.services.email_service import EmailService

    async def _verify(self, *, email, token):
        store["verification"].append((email, token))

    async def _reset(self, *, email, token):
        store["reset"].append((email, token))

    async def _welcome(self, *, email, first_name):
        store["welcome"].append((email, first_name))

    monkeypatch.setattr(EmailService, "send_verification_email", _verify)
    monkeypatch.setattr(EmailService, "send_reset_password_email", _reset)
    monkeypatch.setattr(EmailService, "send_welcome_email", _welcome)
    return store


# ─── Registration ─────────────────────────────────────────────────────────────

async def test_register_success(client):
    resp = await client.post("/api/v1/auth/register", json=registration_payload())
    assert resp.status_code == 201
    body = resp.json()
    assert body["success"] is True
    data = body["data"]
    assert data["user"]["email"] == "ada@example.com"
    assert data["user"]["username"] == "adalovelace"
    assert data["user"]["role"] == "USER"
    assert data["user"]["is_verified"] is False
    assert "password" not in data["user"]
    assert "password_hash" not in data["user"]
    assert data["tokens"]["access_token"]
    assert data["tokens"]["refresh_token"]
    assert data["tokens"]["token_type"] == "bearer"
    assert data["tokens"]["expires_in"] > 0


async def test_register_duplicate_email(client):
    await client.post("/api/v1/auth/register", json=registration_payload())
    resp = await client.post(
        "/api/v1/auth/register",
        json=registration_payload(username="different"),
    )
    assert resp.status_code == 409
    assert resp.json()["error"] == "EmailAlreadyExists"


async def test_register_duplicate_username(client):
    await client.post("/api/v1/auth/register", json=registration_payload())
    resp = await client.post(
        "/api/v1/auth/register",
        json=registration_payload(email="other@example.com"),
    )
    assert resp.status_code == 409
    assert resp.json()["error"] == "UsernameAlreadyExists"


@pytest.mark.parametrize(
    "bad_password",
    ["short1!", "alllowercase1!", "ALLUPPERCASE1!", "NoNumber!!", "NoSpecial123"],
)
async def test_register_weak_password_rejected(client, bad_password):
    resp = await client.post(
        "/api/v1/auth/register", json=registration_payload(password=bad_password)
    )
    assert resp.status_code == 422


async def test_register_normalises_email_and_username(client):
    resp = await client.post(
        "/api/v1/auth/register",
        json=registration_payload(email="ADA@Example.COM", username="AdaLovelace"),
    )
    assert resp.status_code == 201
    data = resp.json()["data"]["user"]
    assert data["email"] == "ada@example.com"
    assert data["username"] == "adalovelace"


# ─── Login ────────────────────────────────────────────────────────────────────

async def test_login_success(client):
    await client.post("/api/v1/auth/register", json=registration_payload())
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "ada@example.com", "password": VALID_PASSWORD},
    )
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["tokens"]["access_token"]
    assert data["user"]["email"] == "ada@example.com"


async def test_login_wrong_password(client):
    await client.post("/api/v1/auth/register", json=registration_payload())
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "ada@example.com", "password": "WrongP@ss1"},
    )
    assert resp.status_code == 401
    assert resp.json()["error"] == "InvalidCredentials"


async def test_login_unknown_email_same_error(client):
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@example.com", "password": VALID_PASSWORD},
    )
    assert resp.status_code == 401
    assert resp.json()["error"] == "InvalidCredentials"


# ─── Current user (/me) ───────────────────────────────────────────────────────

async def _register_and_token(client):
    resp = await client.post("/api/v1/auth/register", json=registration_payload())
    return resp.json()["data"]["tokens"]


async def test_me_with_valid_token(client):
    tokens = await _register_and_token(client)
    resp = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {tokens['access_token']}"},
    )
    assert resp.status_code == 200
    assert resp.json()["data"]["email"] == "ada@example.com"


async def test_me_without_token_rejected(client):
    resp = await client.get("/api/v1/auth/me")
    assert resp.status_code == 401
    assert resp.json()["error"] == "InvalidToken"


async def test_me_with_garbage_token_rejected(client):
    resp = await client.get(
        "/api/v1/auth/me", headers={"Authorization": "Bearer not.a.jwt"}
    )
    assert resp.status_code == 401


async def test_refresh_token_rejected_as_access_token(client):
    tokens = await _register_and_token(client)
    resp = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {tokens['refresh_token']}"},
    )
    assert resp.status_code == 401


# ─── Refresh & rotation ───────────────────────────────────────────────────────

async def test_refresh_issues_new_pair(client):
    tokens = await _register_and_token(client)
    resp = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )
    assert resp.status_code == 200
    new_tokens = resp.json()["data"]["tokens"]
    assert new_tokens["access_token"]
    assert new_tokens["refresh_token"] != tokens["refresh_token"]


async def test_refresh_rotation_invalidates_old_token(client):
    tokens = await _register_and_token(client)
    first = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )
    assert first.status_code == 200
    # Re-using the original (now rotated) refresh token must fail.
    replay = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )
    assert replay.status_code == 401
    assert replay.json()["error"] == "InvalidToken"


# ─── Logout ───────────────────────────────────────────────────────────────────

async def test_logout_revokes_refresh_token(client):
    tokens = await _register_and_token(client)
    logout = await client.post(
        "/api/v1/auth/logout",
        json={"refresh_token": tokens["refresh_token"]},
        headers={"Authorization": f"Bearer {tokens['access_token']}"},
    )
    assert logout.status_code == 200
    # The refresh token can no longer be used.
    resp = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )
    assert resp.status_code == 401


async def test_logout_requires_auth(client):
    tokens = await _register_and_token(client)
    resp = await client.post(
        "/api/v1/auth/logout", json={"refresh_token": tokens["refresh_token"]}
    )
    assert resp.status_code == 401


# ─── Change password ──────────────────────────────────────────────────────────

async def test_change_password_success_and_revokes_sessions(client):
    reg = await client.post("/api/v1/auth/register", json=registration_payload())
    tokens = reg.json()["data"]["tokens"]

    resp = await client.post(
        "/api/v1/auth/change-password",
        json={"current_password": VALID_PASSWORD, "new_password": "NewStr0ng@1"},
        headers={"Authorization": f"Bearer {tokens['access_token']}"},
    )
    assert resp.status_code == 200

    # Old refresh token revoked.
    r = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )
    assert r.status_code == 401

    # Login works with the new password, not the old one.
    old = await client.post(
        "/api/v1/auth/login",
        json={"email": "ada@example.com", "password": VALID_PASSWORD},
    )
    assert old.status_code == 401
    new = await client.post(
        "/api/v1/auth/login",
        json={"email": "ada@example.com", "password": "NewStr0ng@1"},
    )
    assert new.status_code == 200


async def test_change_password_wrong_current(client):
    reg = await client.post("/api/v1/auth/register", json=registration_payload())
    tokens = reg.json()["data"]["tokens"]
    resp = await client.post(
        "/api/v1/auth/change-password",
        json={"current_password": "WrongP@ss1", "new_password": "NewStr0ng@1"},
        headers={"Authorization": f"Bearer {tokens['access_token']}"},
    )
    assert resp.status_code == 401


# ─── Email verification ───────────────────────────────────────────────────────

async def test_email_verification_flow(client, captured_emails):
    await client.post("/api/v1/auth/register", json=registration_payload())
    assert captured_emails["verification"], "verification email should be sent"
    _email, token = captured_emails["verification"][-1]

    resp = await client.post("/api/v1/auth/verify-email", json={"token": token})
    assert resp.status_code == 200
    assert resp.json()["data"]["is_verified"] is True

    # Token is single-use.
    again = await client.post("/api/v1/auth/verify-email", json={"token": token})
    assert again.status_code == 401


async def test_verify_email_invalid_token(client):
    resp = await client.post(
        "/api/v1/auth/verify-email", json={"token": "does-not-exist"}
    )
    assert resp.status_code == 401


async def test_resend_verification(client, captured_emails):
    await client.post("/api/v1/auth/register", json=registration_payload())
    resp = await client.post(
        "/api/v1/auth/resend-verification", json={"email": "ada@example.com"}
    )
    assert resp.status_code == 200
    # A new verification token was issued (register + resend => >= 2).
    assert len(captured_emails["verification"]) >= 2


async def test_resend_verification_unknown_email_neutral(client):
    resp = await client.post(
        "/api/v1/auth/resend-verification", json={"email": "nobody@example.com"}
    )
    assert resp.status_code == 200  # never reveals existence


# ─── Forgot / reset password ──────────────────────────────────────────────────

async def test_forgot_password_neutral_for_unknown(client):
    resp = await client.post(
        "/api/v1/auth/forgot-password", json={"email": "nobody@example.com"}
    )
    assert resp.status_code == 200


async def test_reset_password_flow(client, captured_emails):
    await client.post("/api/v1/auth/register", json=registration_payload())
    forgot = await client.post(
        "/api/v1/auth/forgot-password", json={"email": "ada@example.com"}
    )
    assert forgot.status_code == 200
    assert captured_emails["reset"], "reset email should be sent"
    _email, token = captured_emails["reset"][-1]

    reset = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": token, "new_password": "Reset@Pass9"},
    )
    assert reset.status_code == 200

    # New password works; token is single-use.
    login = await client.post(
        "/api/v1/auth/login",
        json={"email": "ada@example.com", "password": "Reset@Pass9"},
    )
    assert login.status_code == 200
    replay = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": token, "new_password": "Another@Pass9"},
    )
    assert replay.status_code == 401


# ─── Unit: password hashing ───────────────────────────────────────────────────

def test_password_hashing_roundtrip():
    from app.utils.password import hash_password, verify_password

    hashed = hash_password(VALID_PASSWORD)
    assert hashed != VALID_PASSWORD
    assert hashed.startswith("$2")  # bcrypt marker
    assert verify_password(VALID_PASSWORD, hashed) is True
    assert verify_password("wrong", hashed) is False


def test_verify_password_handles_bad_hash():
    from app.utils.password import verify_password

    assert verify_password("x", "") is False
    assert verify_password("x", "not-a-hash") is False


def test_password_strength_validator():
    from app.utils.password import PasswordPolicyError, validate_password_strength

    validate_password_strength(VALID_PASSWORD)  # should not raise
    for bad in ["short1!", "nouppercase1!", "NOLOWER1!", "NoNumber!!", "NoSpecial1"]:
        with pytest.raises(PasswordPolicyError):
            validate_password_strength(bad)


# ─── Unit: JWT primitives ─────────────────────────────────────────────────────

def test_jwt_encode_decode_roundtrip():
    from datetime import timedelta

    from app.utils.jwt_helper import ACCESS_TOKEN_TYPE, create_token, decode_token

    token, jti, _exp = create_token(
        subject="user-123",
        token_type=ACCESS_TOKEN_TYPE,
        expires_delta=timedelta(minutes=5),
        extra_claims={"role": "USER"},
    )
    payload = decode_token(token)
    assert payload["sub"] == "user-123"
    assert payload["type"] == ACCESS_TOKEN_TYPE
    assert payload["jti"] == jti
    assert payload["role"] == "USER"


def test_jwt_rejects_expired_token():
    from datetime import timedelta

    from app.utils.jwt_helper import (
        ACCESS_TOKEN_TYPE,
        TokenDecodeError,
        create_token,
        decode_token,
    )

    token, _jti, _exp = create_token(
        subject="user-123",
        token_type=ACCESS_TOKEN_TYPE,
        expires_delta=timedelta(seconds=-1),  # already expired
    )
    with pytest.raises(TokenDecodeError) as exc:
        decode_token(token)
    assert exc.value.expired is True


def test_jwt_rejects_tampered_token():
    from datetime import timedelta

    from app.utils.jwt_helper import (
        ACCESS_TOKEN_TYPE,
        TokenDecodeError,
        create_token,
        decode_token,
    )

    token, _jti, _exp = create_token(
        subject="user-123",
        token_type=ACCESS_TOKEN_TYPE,
        expires_delta=timedelta(minutes=5),
    )
    with pytest.raises(TokenDecodeError):
        decode_token(token + "tampered")
