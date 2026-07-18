"""
app/modules/shop/services/wishlist_service.py

Wishlist management. Mirrors the cart service pattern: one wishlist per user,
containing distinct products.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.modules.shop.models.wishlist import Wishlist, WishlistItem
from app.modules.shop.models.product import Product
from app.modules.shop.repositories.shop_repositories import (
    WishlistRepository,
    WishlistItemRepository,
    ProductRepository,
)


class WishlistService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.wishlist_repo = WishlistRepository(Wishlist, session)
        self.wishlist_item_repo = WishlistItemRepository(WishlistItem, session)
        self.product_repo = ProductRepository(Product, session)

    async def get_or_create_wishlist(self, user_id: str) -> Wishlist:
        wishlist = await self.wishlist_repo.get_by_user_id(user_id)
        if not wishlist:
            wishlist = Wishlist(user_id=user_id)
            await self.wishlist_repo.add(wishlist)
            wishlist = await self.wishlist_repo.get_by_user_id(user_id)
        return wishlist

    async def add_item(self, user_id: str, product_id: str) -> Wishlist:
        wishlist = await self.get_or_create_wishlist(user_id)
        product = await self.product_repo.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        # Idempotent: adding an item already present is a no-op.
        exists = any(item.product_id == product_id for item in wishlist.items)
        if not exists:
            await self.wishlist_item_repo.add(
                WishlistItem(wishlist_id=wishlist.id, product_id=product_id)
            )
        return await self.get_or_create_wishlist(user_id)

    async def remove_by_product(self, user_id: str, product_id: str) -> Wishlist:
        wishlist = await self.get_or_create_wishlist(user_id)
        item = next(
            (i for i in wishlist.items if i.product_id == product_id), None
        )
        if item:
            await self.wishlist_item_repo.delete(item, hard=True)
        return await self.get_or_create_wishlist(user_id)
