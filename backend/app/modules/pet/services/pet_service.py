"""
app/services/pet_service.py

Core business logic for the Pet Management module (Phase B4): create, read,
update, and soft-delete a pet.

``get_owned_pet`` is the single choke point every other pet-scoped operation
(images, gallery, and every future module's pet-scoped endpoints) should
route through: it resolves a pet by id AND enforces that the caller owns it,
so "load a pet" and "am I allowed to touch it" are never implemented twice.
"""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.http import ForbiddenException
from app.exceptions.pet import DuplicateMicrochipException, PetNotFoundException
from app.modules.pet.models.pet import Pet
from app.modules.user.models.user import User
from app.modules.pet.repositories.pet_repository import PetRepository
from app.modules.pet.schemas.pet import PetCreateRequest, PetReplaceRequest, PetUpdateRequest
from app.utils.datetime_helper import utcnow


class PetService:
    """Create/read/update/delete pets, scoped to their owner."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.pets = PetRepository(session)

    # ─── Ownership resolution ─────────────────────────────────────────────────

    async def get_owned_pet(self, pet_id: str, user: User) -> Pet:
        """
        Resolve a pet by id, raising:
          - ``PetNotFoundException`` (404) if it doesn't exist or is deleted.
          - ``ForbiddenException`` (403) if it exists but belongs to someone
            else — never leaks existence of another user's pet via a 404 vs
            403 distinction, since the caller is already authenticated.
        """
        pet = await self.pets.get_by_id(pet_id)
        if pet is None:
            raise PetNotFoundException()
        if pet.owner_id != user.id:
            raise ForbiddenException("You do not have access to this pet.")
        return pet

    # ─── Reads ────────────────────────────────────────────────────────────────

    async def list_my_pets(self, user: User, *, page: int, per_page: int):
        return await self.pets.list_by_owner(user.id, page=page, per_page=per_page)

    # ─── Writes ───────────────────────────────────────────────────────────────

    async def create_pet(self, user: User, payload: PetCreateRequest) -> Pet:
        from app.core.events.bus import bus
        from app.modules.pet.events import PetCreatedEvent
        
        if payload.microchip_number and await self.pets.microchip_exists(
            payload.microchip_number
        ):
            raise DuplicateMicrochipException()

        pet = Pet(owner_id=user.id, **payload.model_dump())
        pet = await self.pets.add(pet)
        
        await bus.publish(PetCreatedEvent(payload={"pet_id": pet.id, "owner_id": pet.owner_id}))
        return pet

    async def replace_pet(
        self, pet: Pet, payload: PetReplaceRequest
    ) -> Pet:
        """Full replace (PUT) of every editable pet field."""
        from app.core.events.bus import bus
        from app.modules.pet.events import PetUpdatedEvent

        if payload.microchip_number and payload.microchip_number != pet.microchip_number:
            if await self.pets.microchip_exists(
                payload.microchip_number, exclude_pet_id=pet.id
            ):
                raise DuplicateMicrochipException()

        for field, value in payload.model_dump().items():
            setattr(pet, field, value)

        pet = await self.pets.save(pet)
        await bus.publish(PetUpdatedEvent(payload={"pet_id": pet.id, "owner_id": pet.owner_id}))
        return pet

    async def update_pet(self, pet: Pet, payload: PetUpdateRequest) -> Pet:
        """Partial update (PATCH) — only fields explicitly set are applied."""
        from app.core.events.bus import bus
        from app.modules.pet.events import PetUpdatedEvent

        updates = payload.model_dump(exclude_unset=True)

        if "microchip_number" in updates:
            new_chip = updates["microchip_number"]
            if new_chip and new_chip != pet.microchip_number:
                if await self.pets.microchip_exists(new_chip, exclude_pet_id=pet.id):
                    raise DuplicateMicrochipException()

        for field, value in updates.items():
            setattr(pet, field, value)

        pet = await self.pets.save(pet)
        await bus.publish(PetUpdatedEvent(payload={"pet_id": pet.id, "owner_id": pet.owner_id}))
        return pet

    async def delete_pet(self, pet: Pet) -> None:
        """Soft-delete: flag the row, never remove it — future modules key off pet_id."""
        pet.is_deleted = True
        pet.deleted_at = utcnow()
        pet.is_active = False
        await self.pets.save(pet)
