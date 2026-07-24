"""
scripts/clear_all_posts.py

Soft-deletes every community post in the database by setting is_deleted=True.
Run from the backend root:
    ./venv/bin/python scripts/clear_all_posts.py
"""

import asyncio
import sys
import os

# Make sure the backend package is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.core.config import get_settings
from app.database.engine import init_db, _engine


async def clear_posts():
    settings = get_settings()
    await init_db(database_url=settings.DATABASE_URL, environment=settings.ENVIRONMENT)

    # _engine is the module-level singleton set by init_db
    from app.database import engine as eng_module
    engine = eng_module._engine

    async with engine.begin() as conn:
        result = await conn.execute(
            text("SELECT COUNT(*) FROM community_posts WHERE is_deleted = 0")
        )
        count = result.scalar()
        print(f"Found {count} active post(s). Soft-deleting all...")

        await conn.execute(
            text("UPDATE community_posts SET is_deleted = 1 WHERE is_deleted = 0")
        )

    print("✅ Done. All posts have been soft-deleted.")
    print("The community feed will now be empty — only real posts will appear going forward.")


if __name__ == "__main__":
    asyncio.run(clear_posts())
