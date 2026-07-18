"""
app/modules/shop/services/order_service.py

Checkout flow and order status management.
"""

from decimal import Decimal
from typing import Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.modules.shop.models.order import Order, OrderItem, OrderStatus
from app.modules.shop.models.product import Product
from app.modules.shop.repositories.shop_repositories import OrderRepository, ProductRepository
from app.modules.shop.services.cart_service import CartService


class OrderService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.order_repo = OrderRepository(Order, session)
        self.cart_service = CartService(session)
        self.product_repo = ProductRepository(Product, session) # type: ignore

    async def get_user_orders(self, user_id: str) -> Sequence[Order]:
        return await self.order_repo.get_by_user_id(user_id)

    async def create_order_from_cart(self, user_id: str) -> Order:
        cart = await self.cart_service.get_or_create_cart(user_id)
        
        if not cart.items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        total_amount = sum(
            (item.product.price * item.quantity for item in cart.items),
            Decimal("0"),
        )

        # In a real system, tax calculation would be here.
        tax_amount = total_amount * Decimal("0.10")  # 10% flat tax
        
        order = Order(
            user_id=user_id,
            total_amount=total_amount + tax_amount,
            tax_amount=tax_amount,
            status=OrderStatus.PENDING
        )
        await self.order_repo.add(order)
        
        # Move items from cart to order
        for cart_item in cart.items:
            # Check stock again before finalizing
            if cart_item.product.stock < cart_item.quantity:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for {cart_item.product.name}")
                
            # Deduct stock
            cart_item.product.stock -= cart_item.quantity
            
            order_item = OrderItem(
                order_id=order.id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                price_at_purchase=cart_item.product.price
            )
            self.session.add(order_item)
            
        await self.session.flush()
        
        # Clear cart
        await self.cart_service.clear_cart(user_id)
        
        return await self.order_repo.get_by_id(order.id) # type: ignore
