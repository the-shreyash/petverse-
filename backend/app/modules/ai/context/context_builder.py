"""
app/modules/ai/context/context_builder.py

Builds unified context payloads by orchestrating User, Pet, and Health services.
"""

from typing import Dict, Any, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.pet.repositories.pet_repository import PetRepository
# Assuming User and Health repositories exist in a similar manner. 
# We'll use Pet as the main context anchor.


class AIContextBuilder:
    """Builds a rich context dictionary for the AI engine."""
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.pet_repo = PetRepository(session)
        
    async def build_context(self, user_id: str, pet_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Aggregates data to form the AI context.
        """
        context: Dict[str, Any] = {
            "user_id": user_id,
            "pets": []
        }
        
        # If a specific pet is requested
        if pet_id:
            pet = await self.pet_repo.get_by_id(pet_id)
            if pet and pet.owner_id == user_id:
                context["pets"].append(self._serialize_pet_context(pet))
        else:
            # Otherwise, load all pets for the user
            pets = await self.pet_repo.get_all_by_owner(user_id)
            context["pets"] = [self._serialize_pet_context(p) for p in pets]
            
        return context
        
    def _serialize_pet_context(self, pet: Any) -> Dict[str, Any]:
        """Convert a Pet model (and its health data) to a dictionary for AI context."""
        # For a full implementation, we'd also serialize vaccinations, medical_records, etc.
        # Since SQLAlchemy lazy loads, we'd need them selectinloaded in the repo call.
        return {
            "id": pet.id,
            "name": pet.name,
            "species": pet.species.name if pet.species else None,
            "breed": pet.breed,
            "gender": pet.gender.name if pet.gender else None,
            "weight": float(pet.weight) if pet.weight else None,
            "sterilized": pet.sterilized,
            "medical_tags": getattr(pet, "medical_tags", []), # Extensible
        }
