from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException, ForbiddenException, ConflictException
from app.core.events.bus import bus
from app.modules.community.models import AdoptionListing, AdoptionRequest
from app.modules.community.models.enums import AdoptionStatus, AdoptionRequestStatus
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

    async def search(self, **kwargs) -> list[dict]:
        """Listings with optional proximity ranking; distance_km is None when
        the caller supplied no coordinates."""
        rows = await self.repo.search(**kwargs)
        out = []
        for listing, distance in rows:
            out.append({
                "id": listing.id,
                "owner_id": listing.owner_id,
                "pet_id": listing.pet_id,
                "title": listing.title,
                "description": listing.description,
                "status": listing.status,
                "adoption_fee": float(listing.adoption_fee) if listing.adoption_fee is not None else None,
                "city": listing.city,
                "state": listing.state,
                "country": listing.country,
                "latitude": float(listing.latitude) if listing.latitude is not None else None,
                "longitude": float(listing.longitude) if listing.longitude is not None else None,
                "gallery": listing.gallery or [],
                "created_at": listing.created_at,
                "updated_at": listing.updated_at,
                "distance_km": round(distance, 2) if distance is not None else None,
            })
        return out

    async def get_by_id(self, listing_id: str) -> AdoptionListing:
        listing = await self.repo.get_by_id(listing_id)
        if not listing:
            raise NotFoundException("Adoption listing not found")
        return listing

    async def get_detail(self, listing_id: str) -> dict:
        """
        Return an adoption listing enriched with the linked pet's profile
        (species/breed/age/weight/health/images) and the owner's identity, so
        the frontend never has to duplicate pet information on the listing.
        """
        from sqlalchemy import select
        from datetime import date

        from app.modules.pet.models.pet import Pet
        from app.modules.pet.models.pet_gallery_image import PetGalleryImage
        from app.modules.user.models.user import User

        listing = await self.get_by_id(listing_id)
        session = self.repo.session

        result: dict = {
            "id": listing.id,
            "owner_id": listing.owner_id,
            "pet_id": listing.pet_id,
            "title": listing.title,
            "description": listing.description,
            "status": listing.status,
            "adoption_fee": float(listing.adoption_fee) if listing.adoption_fee is not None else None,
            "city": listing.city,
            "state": listing.state,
            "country": listing.country,
            "gallery": listing.gallery or [],
            "created_at": listing.created_at,
            "updated_at": listing.updated_at,
            "pet": None,
            "owner": None,
        }

        # ── Pet profile join ───────────────────────────────────────────────
        pet = (
            await session.execute(select(Pet).where(Pet.id == listing.pet_id))
        ).scalar_one_or_none()
        if pet is not None:
            age_str = None
            if pet.birth_date:
                today = date.today()
                months = (today.year - pet.birth_date.year) * 12 + (today.month - pet.birth_date.month)
                if today.day < pet.birth_date.day:
                    months -= 1
                months = max(months, 0)
                years, rem = divmod(months, 12)
                if years and rem:
                    age_str = f"{years} yr {rem} mo"
                elif years:
                    age_str = f"{years} year{'s' if years > 1 else ''}"
                else:
                    age_str = f"{rem} month{'s' if rem != 1 else ''}"

            gallery_rows = (
                await session.execute(
                    select(PetGalleryImage.image_url)
                    .where(PetGalleryImage.pet_id == pet.id)
                    .order_by(PetGalleryImage.position)
                )
            ).scalars().all()

            result["pet"] = {
                "id": pet.id,
                "name": pet.name,
                "species": pet.species.value if pet.species else None,
                "breed": pet.breed,
                "gender": pet.gender.value if pet.gender else None,
                "birth_date": pet.birth_date.isoformat() if pet.birth_date else None,
                "age": age_str,
                "weight": float(pet.weight) if pet.weight is not None else None,
                "color": pet.color,
                "profile_image": pet.profile_image,
                "description": pet.description,
                "sterilized": pet.sterilized,
                "blood_group": pet.blood_group,
                "gallery": list(gallery_rows),
            }

        # ── Owner identity join ────────────────────────────────────────────
        owner = (
            await session.execute(select(User).where(User.id == listing.owner_id))
        ).scalar_one_or_none()
        if owner is not None:
            full_name = f"{owner.first_name or ''} {owner.last_name or ''}".strip()
            result["owner"] = {
                "id": owner.id,
                "name": full_name or owner.username or "User",
                "avatar": owner.profile_image,
            }

        return result

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

    async def _notify(self, user_id: str, title: str, message: str, entity_id: str, priority=None):
        from app.modules.notifications.services.notification_service import NotificationService
        from app.modules.notifications.schemas.notification import NotificationCreate
        from app.modules.notifications.models.enums import NotificationType, NotificationPriority

        notif_service = NotificationService(self.repo.session)
        await notif_service.create_notification(
            NotificationCreate(
                user_id=user_id,
                type=NotificationType.SOCIAL,
                priority=priority or NotificationPriority.HIGH,
                title=title,
                message=message,
                entity_type="adoption",
                entity_id=entity_id,
            )
        )

    @staticmethod
    def _serialize_request(req, listing=None) -> dict:
        return {
            "id": req.id,
            "listing_id": req.listing_id,
            "applicant_id": req.applicant_id,
            "message": req.message,
            "status": req.status,
            "created_at": req.created_at,
            "listing_title": listing.title if listing else None,
        }

    async def apply_to_listing(
        self, applicant_id: str, listing_id: str, message: Optional[str] = None
    ) -> dict:
        """
        Register interest in an adoption listing.

        The request is persisted so the owner can later accept or reject it —
        a notification alone would leave no state to act on.
        """
        listing = await self.get_by_id(listing_id)
        if listing.owner_id == applicant_id:
            raise ForbiddenException("You cannot apply to your own listing.")

        existing = await self.repo.get_request(listing_id, applicant_id)
        if existing:
            if existing.status == AdoptionRequestStatus.PENDING:
                raise ConflictException("You have already applied to this listing.")
            # Re-applying after a rejection resets the request rather than
            # violating the (listing, applicant) uniqueness constraint.
            existing.status = AdoptionRequestStatus.PENDING
            existing.message = message
            request = await self.repo.save(existing)
        else:
            request = await self.repo.add_request(
                AdoptionRequest(
                    listing_id=listing_id,
                    applicant_id=applicant_id,
                    message=message,
                )
            )

        await self._notify(
            listing.owner_id,
            "New adoption interest",
            f"Someone is interested in adopting {listing.title}."
            + (f' They said: "{message}"' if message else ""),
            listing.id,
        )
        return self._serialize_request(request, listing)

    async def list_requests_for_listing(self, user_id: str, listing_id: str) -> list[dict]:
        listing = await self.get_by_id(listing_id)
        if listing.owner_id != user_id:
            raise ForbiddenException("Only the listing owner can view its requests")
        requests = await self.repo.list_requests_for_listing(listing_id)
        return [self._serialize_request(r, listing) for r in requests]

    async def list_incoming_requests(self, owner_id: str) -> list[dict]:
        requests = await self.repo.list_requests_for_owner(owner_id)
        return [self._serialize_request(r) for r in requests]

    async def list_my_requests(self, applicant_id: str) -> list[dict]:
        requests = await self.repo.list_requests_by_applicant(applicant_id)
        return [self._serialize_request(r) for r in requests]

    async def respond_to_request(self, owner_id: str, request_id: str, accept: bool) -> dict:
        request = await self.repo.get_request_by_id(request_id)
        if not request:
            raise NotFoundException("Adoption request not found")

        listing = await self.get_by_id(request.listing_id)
        if listing.owner_id != owner_id:
            raise ForbiddenException("Only the listing owner can respond to this request")
        if request.status != AdoptionRequestStatus.PENDING:
            raise ConflictException(f"This request is already {request.status.value.lower()}.")

        request.status = (
            AdoptionRequestStatus.ACCEPTED if accept else AdoptionRequestStatus.REJECTED
        )
        request = await self.repo.save(request)

        if accept:
            # Accepting one applicant takes the pet off the market and closes
            # the remaining requests, so state stays consistent.
            listing.status = AdoptionStatus.PENDING
            await self.repo.save(listing)
            await self.repo.reject_other_pending(listing.id, request.id)

        await self._notify(
            request.applicant_id,
            "Adoption request accepted" if accept else "Adoption request declined",
            (
                f"Your request to adopt {listing.title} was accepted! The owner will be in touch."
                if accept
                else f"Your request to adopt {listing.title} was declined."
            ),
            listing.id,
        )
        return self._serialize_request(request, listing)
