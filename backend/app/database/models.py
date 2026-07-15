"""
app/database/models.py

Registry of all SQLAlchemy models in the application.
Importing this module ensures all models are registered on Base.metadata.
Used by Alembic (env.py) and Pytest (conftest.py).
"""

import app.modules.user.models.user  # noqa: F401
import app.modules.user.models.user_privacy  # noqa: F401
import app.modules.user.models.user_preference  # noqa: F401
import app.modules.pet.models.pet  # noqa: F401
import app.modules.pet.models.pet_gallery_image  # noqa: F401
import app.modules.auth.models.verification_token  # noqa: F401
import app.modules.auth.models.refresh_token  # noqa: F401

try:
    import app.modules.health.models  # noqa: F401
except ImportError:
    pass

import app.modules.ai.models.ai_history  # noqa: F401
import app.modules.ai.models.ai_usage  # noqa: F401

import app.modules.shop.models.product  # noqa: F401
import app.modules.shop.models.cart  # noqa: F401
import app.modules.shop.models.order  # noqa: F401
import app.modules.shop.models.wishlist  # noqa: F401

import app.modules.community.models  # noqa: F401
import app.modules.notifications.models  # noqa: F401
