"""
app/modules/shop/repositories/shop_repositories.py

Repositories for Commerce Engine models.
"""

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.repository import BaseRepository
from app.modules.shop.models.product import Product, Category
from app.modules.shop.models.cart import Cart, CartItem
from app.modules.shop.models.order import Order, OrderItem
from app.modules.shop.models.wishlist import Wishlist, WishlistItem


class CategoryRepository(BaseRepository[Category]):
    pass


class ProductRepository(BaseRepository[Product]):
    async def get_by_category(self, category_id: str) -> Sequence[Product]:
        stmt = select(self.model).where(self.model.category_id == category_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()


class CartRepository(BaseRepository[Cart]):
    async def get_by_user_id(self, user_id: str) -> Optional[Cart]:
        stmt = (
            select(self.model)
            .where(self.model.user_id == user_id)
            .options(selectinload(self.model.items).selectinload(CartItem.product))
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()


class CartItemRepository(BaseRepository[CartItem]):
    pass


class OrderRepository(BaseRepository[Order]):
    async def get_by_user_id(self, user_id: str) -> Sequence[Order]:
        stmt = (
            select(self.model)
            .where(self.model.user_id == user_id)
            .options(selectinload(self.model.items).selectinload(OrderItem.product))
            .order_by(self.model.created_at.desc())
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()


class WishlistRepository(BaseRepository[Wishlist]):
    async def get_by_user_id(self, user_id: str) -> Optional[Wishlist]:
        stmt = (
            select(self.model)
            .where(self.model.user_id == user_id)
            .options(selectinload(self.model.items).selectinload(WishlistItem.product))
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()


class WishlistItemRepository(BaseRepository[WishlistItem]):
    pass
