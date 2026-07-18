"""
app/modules/shop/services/cart_service.py

Cart management and pricing calculations.
"""

from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.modules.shop.models.cart import Cart, CartItem
from app.modules.shop.repositories.shop_repositories import CartRepository, CartItemRepository, ProductRepository
from app.modules.shop.models.product import Product


class CartService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.cart_repo = CartRepository(Cart, session)
        self.cart_item_repo = CartItemRepository(CartItem, session)
        self.product_repo = ProductRepository(Product, session)

    async def get_or_create_cart(self, user_id: str) -> Cart:
        cart = await self.cart_repo.get_by_user_id(user_id)
        if not cart:
            cart = Cart(user_id=user_id)
            await self.cart_repo.add(cart)
        return cart

    async def add_item(self, user_id: str, product_id: str, quantity: int) -> Cart:
        cart = await self.get_or_create_cart(user_id)
        product = await self.product_repo.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        if product.stock < quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")

        # Check if item exists in cart
        existing_item = next((item for item in cart.items if item.product_id == product_id), None)
        if existing_item:
            existing_item.quantity += quantity
            await self.cart_item_repo.save(existing_item)
        else:
            new_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
            await self.cart_item_repo.add(new_item)
            
        return await self.get_or_create_cart(user_id) # Reload with relations

    async def remove_item(self, user_id: str, item_id: str) -> Cart:
        cart = await self.get_or_create_cart(user_id)
        
        item_to_remove = next((item for item in cart.items if item.id == item_id), None)
        if not item_to_remove:
            raise HTTPException(status_code=404, detail="Item not found in cart")
            
        await self.cart_item_repo.delete(item_to_remove, hard=True)
        return await self.get_or_create_cart(user_id)
        
    async def update_item_quantity(self, user_id: str, item_id: str, quantity: int) -> Cart:
        cart = await self.get_or_create_cart(user_id)
        item = next((i for i in cart.items if i.id == item_id), None)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found in cart")
        if quantity < 1:
            return await self.remove_item(user_id, item_id)
        item.quantity = quantity
        await self.cart_item_repo.save(item)
        return await self.get_or_create_cart(user_id)

    async def clear_cart(self, user_id: str) -> None:
        cart = await self.get_or_create_cart(user_id)
        for item in list(cart.items):
            await self.cart_item_repo.delete(item, hard=True)
