"""
app/modules/shop/models/cart.py

Models for Shopping Cart and Cart Items.
"""

from __future__ import annotations

from sqlalchemy import ForeignKey, String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Cart(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Shopping cart owned by a User."""
    __tablename__ = "shop_carts"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False, unique=True)
    
    items: Mapped[list["CartItem"]] = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Cart id={self.id} user_id={self.user_id}>"


class CartItem(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """An individual item inside a Cart."""
    __tablename__ = "shop_cart_items"

    cart_id: Mapped[str] = mapped_column(String(36), ForeignKey("shop_carts.id", ondelete="CASCADE"), index=True, nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("shop_products.id", ondelete="CASCADE"), index=True, nullable=False)
    
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    cart: Mapped["Cart"] = relationship("Cart", back_populates="items")
    product: Mapped["Product"] = relationship("Product", lazy="selectin") # type: ignore

    def __repr__(self) -> str:
        return f"<CartItem id={self.id} cart_id={self.cart_id} product_id={self.product_id} qty={self.quantity}>"
