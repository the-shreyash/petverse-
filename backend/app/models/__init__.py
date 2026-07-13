"""
app/models/__init__.py

Model registry.

Importing every model here serves two purposes:
  1. Alembic's ``env.py`` does ``import app.models`` and then reads
     ``Base.metadata`` — so every model listed here is picked up by
     ``alembic revision --autogenerate`` automatically.
  2. SQLAlchemy relationship/foreign-key resolution needs all classes imported
     before the mappers are configured.

When you add a model in a future phase, import it here.
"""

from app.models.enums import AuthProvider, UserRole, VerificationTokenType
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.models.verification_token import VerificationToken

__all__ = [
    "AuthProvider",
    "UserRole",
    "VerificationTokenType",
    "User",
    "RefreshToken",
    "VerificationToken",
]
