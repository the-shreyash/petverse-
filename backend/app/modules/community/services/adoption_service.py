from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException, ForbiddenException
from app.core.events.bus import bus
from app.modules.community.models import AdoptionListing
from app.modules.community.schemas.adoption import AdoptionListingCreate, AdoptionListingUpdate
from app.modules.community.repositories.adoption_repository import AdoptionRepository
from app.modules.community.events import AdoptionRequestEvent

class AdoptionService:
    def __init__(self, session: AsyncSession):
        self.repo = AdoptionRepository(session)

    async def create_listing(self, user_id: str, data: AdoptionListingCreate) -> AdoptionListing:
        listing = AdoptionListing(**data.model_dump(), owner_id=user_id)
        listing = await self.repo.add(listing)

        await bus.publish(AdoptionRequestEvent(payload={
            "adoption_id": listing.id,
            "owner_id": user_id,
            "pet_id": listing.pet_id
        }))

        return listing

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[AdoptionListing]:
        return await self.repo.get_all(skip=skip, limit=limit)

    async def get_by_id(self, listing_id: str) -> AdoptionListing:
        listing = await self.repo.get_by_id(listing_id)
        if not listing:
            raise NotFoundException("Adoption listing not found")
        return listing

    async def update_listing(self, user_id: str, listing_id: str, data: AdoptionListingUpdate) -> AdoptionListing:
        listing = await self.get_by_id(listing_id)
        if listing.owner_id != user_id:
            raise ForbiddenException("You can only edit your own adoption listings")

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(listing, key, value)
            
        return await self.repo.save(listing)

    async def delete_listing(self, user_id: str, listing_id: str) -> None:
        listing = await self.get_by_id(listing_id)
        if listing.owner_id != user_id:
            raise ForbiddenException("You can only delete your own adoption listings")

        await self.repo.delete(listing)
