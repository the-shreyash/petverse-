"""
tests/test_pets.py

End-to-end tests for the Phase B4 Pet Management module.

Covered success criteria:
  ✔ Create / get / list pets
  ✔ Replace (PUT) / partial update (PATCH)
  ✔ Soft delete (excluded from list/get/search afterwards)
  ✔ Search + filters + pagination
  ✔ Profile / cover image upload
  ✔ Gallery add / list / delete
  ✔ Authorization (auth required, ownership enforced)
  ✔ Validation (species enum, birth date, microchip format, duplicate microchip)
"""

from __future__ import annotations

import base64

from tests.conftest import registration_payload

# A minimal valid 1x1 transparent PNG.
_PNG_BYTES = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY"
    "42YAAAAASUVORK5CYII="
)


async def _register_and_token(client, **overrides) -> dict:
    resp = await client.post("/api/v1/auth/register", json=registration_payload(**overrides))
    return resp.json()["data"]["tokens"]


def _auth_header(tokens: dict) -> dict:
    return {"Authorization": f"Bearer {tokens['access_token']}"}


def _pet_payload(**overrides):
    body = {
        "name": "Buddy",
        "species": "DOG",
        "breed": "Golden Retriever",
        "gender": "MALE",
        "birth_date": "2022-01-15",
        "weight": 28.5,
        "height": 55.0,
        "color": "Golden",
        "sterilized": True,
        "description": "Friendly and energetic.",
    }
    body.update(overrides)
    return body


async def _create_pet(client, tokens, **overrides):
    return await client.post(
        "/api/v1/pets", json=_pet_payload(**overrides), headers=_auth_header(tokens)
    )


# ─── Create ───────────────────────────────────────────────────────────────────

async def test_create_pet(client):
    tokens = await _register_and_token(client)
    resp = await _create_pet(client, tokens)
    assert resp.status_code == 201
    data = resp.json()["data"]
    assert data["name"] == "Buddy"
    assert data["species"] == "DOG"
    assert data["status"] == "ACTIVE"
    assert data["is_active"] is True
    assert data["age"] is not None


async def test_create_pet_requires_auth(client):
    resp = await client.post("/api/v1/pets", json=_pet_payload())
    assert resp.status_code == 401


async def test_create_pet_invalid_species_rejected(client):
    tokens = await _register_and_token(client)
    resp = await _create_pet(client, tokens, species="DRAGON")
    assert resp.status_code == 422


async def test_create_pet_future_birth_date_rejected(client):
    tokens = await _register_and_token(client)
    resp = await _create_pet(client, tokens, birth_date="2099-01-01")
    assert resp.status_code == 422


async def test_create_pet_invalid_microchip_rejected(client):
    tokens = await _register_and_token(client)
    resp = await _create_pet(client, tokens, microchip_number="bad chip!")
    assert resp.status_code == 422


async def test_create_pet_duplicate_microchip_rejected(client):
    tokens = await _register_and_token(client)
    await _create_pet(client, tokens, microchip_number="985141000123456")
    resp = await _create_pet(client, tokens, name="Max", microchip_number="985141000123456")
    assert resp.status_code == 409
    assert resp.json()["error"] == "DuplicateMicrochip"


# ─── Get / list ─────────────────────────────────────────────────────────────────

async def test_get_pet_details(client):
    tokens = await _register_and_token(client)
    created = (await _create_pet(client, tokens)).json()["data"]
    resp = await client.get(f"/api/v1/pets/{created['id']}", headers=_auth_header(tokens))
    assert resp.status_code == 200
    assert resp.json()["data"]["id"] == created["id"]


async def test_get_pet_not_found(client):
    tokens = await _register_and_token(client)
    resp = await client.get("/api/v1/pets/does-not-exist", headers=_auth_header(tokens))
    assert resp.status_code == 404
    assert resp.json()["error"] == "PetNotFound"


async def test_list_my_pets_and_pagination(client):
    tokens = await _register_and_token(client)
    for i in range(3):
        await _create_pet(client, tokens, name=f"Pet{i}", microchip_number=None)

    resp = await client.get(
        "/api/v1/pets", params={"page": 1, "per_page": 2}, headers=_auth_header(tokens)
    )
    assert resp.status_code == 200
    body = resp.json()
    assert len(body["data"]) == 2
    assert body["meta"]["total"] == 3
    assert body["meta"]["total_pages"] == 2
    assert body["meta"]["has_next"] is True


# ─── Update ───────────────────────────────────────────────────────────────────

async def test_put_replaces_pet(client):
    tokens = await _register_and_token(client)
    created = (await _create_pet(client, tokens)).json()["data"]
    resp = await client.put(
        f"/api/v1/pets/{created['id']}",
        json=_pet_payload(name="Buddy Updated", status="LOST", is_active=False),
        headers=_auth_header(tokens),
    )
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["name"] == "Buddy Updated"
    assert data["status"] == "LOST"
    assert data["is_active"] is False


async def test_patch_partial_update(client):
    tokens = await _register_and_token(client)
    created = (await _create_pet(client, tokens)).json()["data"]
    resp = await client.patch(
        f"/api/v1/pets/{created['id']}",
        json={"color": "White"},
        headers=_auth_header(tokens),
    )
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["color"] == "White"
    assert data["name"] == "Buddy"  # untouched


# ─── Delete (soft) ──────────────────────────────────────────────────────────────

async def test_delete_pet_soft_deletes(client):
    tokens = await _register_and_token(client)
    created = (await _create_pet(client, tokens)).json()["data"]

    resp = await client.delete(f"/api/v1/pets/{created['id']}", headers=_auth_header(tokens))
    assert resp.status_code == 200

    get_resp = await client.get(f"/api/v1/pets/{created['id']}", headers=_auth_header(tokens))
    assert get_resp.status_code == 404

    list_resp = await client.get("/api/v1/pets", headers=_auth_header(tokens))
    assert list_resp.json()["meta"]["total"] == 0


# ─── Authorization (ownership) ─────────────────────────────────────────────────

async def test_cannot_access_another_users_pet(client):
    owner_tokens = await _register_and_token(client)
    created = (await _create_pet(client, owner_tokens)).json()["data"]

    other_tokens = await _register_and_token(
        client, email="other@example.com", username="otheruser"
    )
    resp = await client.get(
        f"/api/v1/pets/{created['id']}", headers=_auth_header(other_tokens)
    )
    assert resp.status_code == 403
    assert resp.json()["error"] == "Forbidden"


async def test_cannot_delete_another_users_pet(client):
    owner_tokens = await _register_and_token(client)
    created = (await _create_pet(client, owner_tokens)).json()["data"]

    other_tokens = await _register_and_token(
        client, email="other2@example.com", username="otheruser2"
    )
    resp = await client.delete(
        f"/api/v1/pets/{created['id']}", headers=_auth_header(other_tokens)
    )
    assert resp.status_code == 403


# ─── Search ───────────────────────────────────────────────────────────────────

async def test_search_by_name_and_species(client):
    tokens = await _register_and_token(client)
    await _create_pet(client, tokens, name="Buddy", species="DOG", microchip_number=None)
    await _create_pet(client, tokens, name="Whiskers", species="CAT", microchip_number=None)

    resp = await client.get(
        "/api/v1/pets/search",
        params={"species": "CAT"},
        headers=_auth_header(tokens),
    )
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert len(data) == 1
    assert data[0]["name"] == "Whiskers"

    resp2 = await client.get(
        "/api/v1/pets/search",
        params={"name": "bud"},
        headers=_auth_header(tokens),
    )
    assert len(resp2.json()["data"]) == 1
    assert resp2.json()["data"][0]["name"] == "Buddy"


async def test_search_only_scoped_to_own_pets(client):
    tokens = await _register_and_token(client)
    await _create_pet(client, tokens, microchip_number=None)

    other_tokens = await _register_and_token(
        client, email="other3@example.com", username="otheruser3"
    )
    resp = await client.get("/api/v1/pets/search", headers=_auth_header(other_tokens))
    assert resp.json()["data"] == []


# ─── Images ───────────────────────────────────────────────────────────────────

async def test_profile_and_cover_image_upload(client):
    tokens = await _register_and_token(client)
    created = (await _create_pet(client, tokens)).json()["data"]
    pet_id = created["id"]

    profile = await client.post(
        f"/api/v1/pets/{pet_id}/profile-image",
        files={"file": ("p.png", _PNG_BYTES, "image/png")},
        headers=_auth_header(tokens),
    )
    assert profile.status_code == 200
    assert profile.json()["data"]["profile_image"].startswith("/uploads/pets/profile/")

    cover = await client.post(
        f"/api/v1/pets/{pet_id}/cover-image",
        files={"file": ("c.png", _PNG_BYTES, "image/png")},
        headers=_auth_header(tokens),
    )
    assert cover.status_code == 200
    assert cover.json()["data"]["cover_image"].startswith("/uploads/pets/cover/")


async def test_image_upload_rejects_bad_type(client):
    tokens = await _register_and_token(client)
    created = (await _create_pet(client, tokens)).json()["data"]
    resp = await client.post(
        f"/api/v1/pets/{created['id']}/profile-image",
        files={"file": ("evil.txt", b"not an image", "text/plain")},
        headers=_auth_header(tokens),
    )
    assert resp.status_code == 422
    assert resp.json()["error"] == "InvalidPetImage"


# ─── Gallery ──────────────────────────────────────────────────────────────────

async def test_gallery_add_list_delete(client):
    tokens = await _register_and_token(client)
    created = (await _create_pet(client, tokens)).json()["data"]
    pet_id = created["id"]

    add = await client.post(
        f"/api/v1/pets/{pet_id}/gallery",
        files={"file": ("g.png", _PNG_BYTES, "image/png")},
        headers=_auth_header(tokens),
    )
    assert add.status_code == 201
    image_id = add.json()["data"]["id"]

    listing = await client.get(
        f"/api/v1/pets/{pet_id}/gallery", headers=_auth_header(tokens)
    )
    assert len(listing.json()["data"]) == 1

    delete = await client.delete(
        f"/api/v1/pets/{pet_id}/gallery/{image_id}", headers=_auth_header(tokens)
    )
    assert delete.status_code == 200

    listing2 = await client.get(
        f"/api/v1/pets/{pet_id}/gallery", headers=_auth_header(tokens)
    )
    assert listing2.json()["data"] == []


async def test_gallery_delete_missing_image_404(client):
    tokens = await _register_and_token(client)
    created = (await _create_pet(client, tokens)).json()["data"]
    resp = await client.delete(
        f"/api/v1/pets/{created['id']}/gallery/does-not-exist",
        headers=_auth_header(tokens),
    )
    assert resp.status_code == 404
    assert resp.json()["error"] == "GalleryImageNotFound"
