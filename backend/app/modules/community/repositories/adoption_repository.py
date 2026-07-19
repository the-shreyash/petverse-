from typing import Optional

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.repository import BaseRepository
from app.modules.community.models import AdoptionListing, AdoptionRequest
from app.modules.community.models.enums import AdoptionRequestStatus

EARTH_RADIUS_KM = 6371.0


class AdoptionRepository(BaseRepository[AdoptionListing]):
    def __init__(self, session: AsyncSession):
        super().__init__(AdoptionListing, session)

    def _distance_km(self, lat: float, lng: float):
        """Great-circle distance expression (Haversine) in kilometres.

        Uses plain trig functions so it runs on stock MySQL without spatial
        types. ``least(1.0, ...)`` guards against float rounding pushing the
        cosine above 1, which would make ``acos`` return NULL.
        """
        cos_term = (
            func.cos(func.radians(lat)) * func.cos(func.radians(self.model.latitude))
            * func.cos(func.radians(self.model.longitude) - func.radians(lng))
            + func.sin(func.radians(lat)) * func.sin(func.radians(self.model.latitude))
        )
        return EARTH_RADIUS_KM * func.acos(func.least(1.0, cos_term))

    async def search(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        species: Optional[str] = None,
        city: Optional[str] = None,
        status: Optional[str] = None,
        lat: Optional[float] = None,
        lng: Optional[float] = None,
        radius_km: Optional[float] = None,
    ) -> list[tuple[AdoptionListing, Optional[float]]]:
        """Return (listing, distance_km) pairs.

        When coordinates are supplied, results are sorted nearest-first and
        optionally constrained to a radius. Without coordinates it falls back to
        newest-first so the page still works when geolocation is denied.
        """
        has_geo = lat is not None and lng is not None

        if has_geo:
            distance = self._distance_km(lat, lng).label("distance_km")
            stmt = select(self.model, distance).where(self.model.is_deleted.is_(False))
            # Rows without coordinates cannot be ranked by distance; exclude them
            # from proximity search rather than silently sorting them first.
            stmt = stmt.where(
                and_(self.model.latitude.is_not(None), self.model.longitude.is_not(None))
            )
            if radius_km is not None:
                stmt = stmt.having(distance <= radius_km)
            stmt = stmt.order_by(distance.asc())
        else:
            stmt = (
                select(self.model)
                .where(self.model.is_deleted.is_(False))
                .order_by(self.model.created_at.desc())
            )

        if city:
            stmt = stmt.where(self.model.city.ilike(f"%{city}%"))
        if status:
            stmt = stmt.where(self.model.status == status)

        stmt = stmt.offset(skip).limit(limit)
        result = await self.session.execute(stmt)

        if has_geo:
            return [(row[0], float(row[1]) if row[1] is not None else None) for row in result.all()]
        return [(row, None) for row in result.scalars().all()]

    # ── Requests ──────────────────────────────────────────────────────────

    async def get_request(self, listing_id: str, applicant_id: str) -> Optional[AdoptionRequest]:
        stmt = select(AdoptionRequest).where(
            AdoptionRequest.listing_id == listing_id,
            AdoptionRequest.applicant_id == applicant_id,
        )
        return (await self.session.execute(stmt)).scalar_one_or_none()

    async def get_request_by_id(self, request_id: str) -> Optional[AdoptionRequest]:
        stmt = select(AdoptionRequest).where(AdoptionRequest.id == request_id)
        return (await self.session.execute(stmt)).scalar_one_or_none()

    async def add_request(self, request: AdoptionRequest) -> AdoptionRequest:
        self.session.add(request)
        await self.session.flush()
        await self.session.refresh(request)
        return request

    async def list_requests_for_listing(self, listing_id: str) -> list[AdoptionRequest]:
        stmt = (
            select(AdoptionRequest)
            .where(AdoptionRequest.listing_id == listing_id)
            .order_by(AdoptionRequest.created_at.desc())
        )
        return list((await self.session.execute(stmt)).scalars().all())

    async def list_requests_by_applicant(self, applicant_id: str) -> list[AdoptionRequest]:
        stmt = (
            select(AdoptionRequest)
            .where(AdoptionRequest.applicant_id == applicant_id)
            .order_by(AdoptionRequest.created_at.desc())
        )
        return list((await self.session.execute(stmt)).scalars().all())

    async def list_requests_for_owner(self, owner_id: str) -> list[AdoptionRequest]:
        listing_ids = select(self.model.id).where(self.model.owner_id == owner_id)
        stmt = (
            select(AdoptionRequest)
            .where(AdoptionRequest.listing_id.in_(listing_ids))
            .order_by(AdoptionRequest.created_at.desc())
        )
        return list((await self.session.execute(stmt)).scalars().all())

    async def reject_other_pending(self, listing_id: str, accepted_request_id: str) -> None:
        """Once one applicant is accepted, the rest can no longer be pending."""
        requests = await self.list_requests_for_listing(listing_id)
        for r in requests:
            if r.id != accepted_request_id and r.status == AdoptionRequestStatus.PENDING:
                r.status = AdoptionRequestStatus.REJECTED
                self.session.add(r)
        await self.session.flush()
