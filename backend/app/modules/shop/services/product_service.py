"""
app/modules/shop/services/product_service.py

Product and Category management.
"""

from typing import Sequence, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_

from app.modules.shop.models.product import Product, Category
from app.modules.shop.repositories.shop_repositories import ProductRepository, CategoryRepository


class ProductService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.product_repo = ProductRepository(Product, session)
        self.category_repo = CategoryRepository(Category, session)

    async def get_all_categories(self) -> Sequence[Category]:
        return await self.category_repo.get_all()

    async def get_products(self, skip: int = 0, limit: int = 100) -> Sequence[Product]:
        return await self.product_repo.get_all(skip=skip, limit=limit)

    async def get_product_by_id(self, product_id: str) -> Optional[Product]:
        return await self.product_repo.get_by_id(product_id)

    async def search_products(self, query: str) -> Sequence[Product]:
        stmt = (
            select(Product)
            .where(
                or_(
                    Product.name.ilike(f"%{query}%"),
                    Product.description.ilike(f"%{query}%"),
                    Product.brand.ilike(f"%{query}%")
                )
            )
            .limit(50)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()
