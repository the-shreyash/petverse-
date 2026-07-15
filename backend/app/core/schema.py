"""
app/core/schema.py

Provides the generic PetVerseBaseModel for all schemas to inherit from.
"""

from pydantic import BaseModel, ConfigDict


class PetVerseBaseModel(BaseModel):
    """
    Base Pydantic model for PetVerse.
    Provides standard configuration such as allowing instantiation from ORM objects.
    """
    model_config = ConfigDict(from_attributes=True)
