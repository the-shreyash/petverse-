from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException, ForbiddenException
from app.core.events.bus import bus
from app.modules.community.models import LostPet
from app.modules.community.schemas.lost_pet import LostPetCreate, LostPetUpdate
from app.modules.community.repositories.lost_pet_repository import LostPetRepository
from app.modules.community.events import LostPetReportedEvent

class LostPetService:
    def __init__(self, session: AsyncSession):
        self.repo = LostPetRepository(session)

    async def report_lost_pet(self, user_id: str, data: LostPetCreate) -> LostPet:
        lost_pet = LostPet(**data.model_dump(), owner_id=user_id)
        lost_pet = await self.repo.add(lost_pet)

        await bus.publish(LostPetReportedEvent(payload={
            "lost_pet_id": lost_pet.id,
            "owner_id": user_id,
            "pet_id": lost_pet.pet_id,
            "location": lost_pet.last_seen_location
        }))

        return lost_pet

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[LostPet]:
        return await self.repo.get_all(skip=skip, limit=limit)

    async def get_by_id(self, lost_pet_id: str) -> LostPet:
        lost_pet = await self.repo.get_by_id(lost_pet_id)
        if not lost_pet:
            raise NotFoundException("Lost pet report not found")
        return lost_pet

    async def update_report(self, user_id: str, lost_pet_id: str, data: LostPetUpdate) -> LostPet:
        lost_pet = await self.get_by_id(lost_pet_id)
        if lost_pet.owner_id != user_id:
            raise ForbiddenException("You can only edit your own lost pet reports")

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(lost_pet, key, value)
            
        return await self.repo.save(lost_pet)

    async def delete_report(self, user_id: str, lost_pet_id: str) -> None:
        lost_pet = await self.get_by_id(lost_pet_id)
        if lost_pet.owner_id != user_id:
            raise ForbiddenException("You can only delete your own lost pet reports")

        await self.repo.delete(lost_pet, hard=True) # Soft delete wasn't specified but we can use default BaseRepository logic which soft deletes if is_deleted exists. LostPet doesn't have it in our model, so it hard deletes.
