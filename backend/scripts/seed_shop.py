"""
scripts/seed_shop.py

Idempotent shop catalogue seeder — creates baseline product categories and a
handful of real products so the shop renders a populated catalogue instead of
an empty placeholder. Safe to run repeatedly: it skips rows that already exist.

Run from the backend/ directory:
    ./venv/bin/python scripts/seed_shop.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import create_engine, select  # noqa: E402
from sqlalchemy.orm import Session  # noqa: E402

import app.database.models  # noqa: F401,E402  (registers all models)
from app.core.config import get_settings  # noqa: E402
from app.modules.shop.models.product import Category, Product  # noqa: E402


def slugify(value: str) -> str:
    return "-".join(value.lower().split())


CATEGORIES = [
    ("Food", "Nutritious meals and kibble for every life stage."),
    ("Toys", "Enrichment and play for happy, active pets."),
    ("Health", "Supplements, grooming and wellness essentials."),
    ("Accessories", "Collars, beds, carriers and everyday gear."),
]

PRODUCTS = [
    # (name, brand, category, price, discount, stock, rating, pet_types)
    ("Grain-Free Chicken Kibble", "NutriPaws", "Food", 34.99, 10.0, 120, 4.6, ["Dog"]),
    ("Salmon & Rice Adult Formula", "OceanTail", "Food", 42.50, None, 80, 4.7, ["Cat", "Dog"]),
    ("Kitten Wet Food Variety Pack", "TinyWhiskers", "Food", 19.99, 5.0, 200, 4.4, ["Cat"]),
    ("Durable Rope Tug Toy", "PlayFetch", "Toys", 9.99, None, 300, 4.3, ["Dog"]),
    ("Feather Wand Teaser", "PounceCo", "Toys", 7.49, None, 250, 4.5, ["Cat"]),
    ("Joint Care Chews", "VitalPet", "Health", 24.95, 15.0, 90, 4.8, ["Dog"]),
    ("Omega-3 Skin & Coat Oil", "GlossyCoat", "Health", 18.75, None, 110, 4.5, ["Cat", "Dog"]),
    ("Orthopedic Memory-Foam Bed", "SnoozeWell", "Accessories", 59.00, 20.0, 45, 4.9, ["Dog"]),
    ("Adjustable Nylon Collar", "TrailBuddy", "Accessories", 12.99, None, 180, 4.2, ["Dog", "Cat"]),
    ("Ceramic Non-Slip Food Bowl", "MealTime", "Accessories", 15.50, None, 140, 4.6, ["Cat", "Dog"]),
]


def run() -> None:
    settings = get_settings()
    # Reuse the same MySQL server via a sync driver for a simple script.
    sync_url = settings.DATABASE_URL.replace("mysql+aiomysql", "mysql+pymysql")
    engine = create_engine(sync_url)

    with Session(engine) as db:
        cat_by_name: dict[str, Category] = {}
        for name, desc in CATEGORIES:
            cat = db.execute(
                select(Category).where(Category.name == name)
            ).scalar_one_or_none()
            if not cat:
                cat = Category(name=name, description=desc, slug=slugify(name))
                db.add(cat)
                db.flush()
            cat_by_name[name] = cat

        created = 0
        for name, brand, cat_name, price, discount, stock, rating, pet_types in PRODUCTS:
            exists = db.execute(
                select(Product).where(Product.name == name)
            ).scalar_one_or_none()
            if exists:
                continue
            db.add(
                Product(
                    name=name,
                    brand=brand,
                    description=f"{name} by {brand}.",
                    category_id=cat_by_name[cat_name].id,
                    price=price,
                    discount=discount,
                    stock=stock,
                    rating=rating,
                    pet_types=pet_types,
                    is_active=True,
                )
            )
            created += 1

        db.commit()
        print(f"Seed complete. Categories ensured: {len(CATEGORIES)}. Products created: {created}.")


if __name__ == "__main__":
    run()
