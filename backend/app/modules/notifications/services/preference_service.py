from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.notifications.models import NotificationPreference
from app.modules.notifications.schemas.preference import NotificationPreferenceUpdate
from app.modules.notifications.repositories.preference_repository import PreferenceRepository

class PreferenceService:
    def __init__(self, session: AsyncSession):
        self.repo = PreferenceRepository(session)

    async def get_preferences(self, user_id: str) -> NotificationPreference:
        pref = await self.repo.get_by_user(user_id)
        if not pref:
            # Create default preferences lazily if they don't exist
            pref = NotificationPreference(user_id=user_id)
            pref = await self.repo.add(pref)
        return pref

    async def update_preferences(self, user_id: str, data: NotificationPreferenceUpdate) -> NotificationPreference:
        pref = await self.get_preferences(user_id)
        
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(pref, key, value)
            
        return await self.repo.save(pref)
