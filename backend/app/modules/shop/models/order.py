"""
app/modules/shop/models/order.py

Models for Orders and Order Items.
"""

from __future__ import annotations

from sqlalchemy import ForeignKey, String, Integer, Numeric, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin
import enum


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    PACKED = "PACKED"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class Order(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """An order placed by a User."""
    __tablename__ = "shop_orders"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="RESTRICT"), index=True, nullable=False)
    
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus, native_enum=False, length=20),
        default=OrderStatus.PENDING,
        nullable=False,
        index=True
    )
    
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    tax_amount: Mapped[float] = mapped_column(Numeric(10, 2), default=0.0, nullable=False)
    
    items: Mapped[list["OrderItem"]] = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Order id={self.id} user_id={self.user_id} status={self.status}>"


class OrderItem(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """An individual item inside an Order."""
    __tablename__ = "shop_order_items"

    order_id: Mapped[str] = mapped_column(String(36), ForeignKey("shop_orders.id", ondelete="CASCADE"), index=True, nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("shop_products.id", ondelete="RESTRICT"), index=True, nullable=False)
    
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    # Store price at time of purchase
    price_at_purchase: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)

    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped["Product"] = relationship("Product", lazy="selectin") # type: ignore

    def __repr__(self) -> str:
        return f"<OrderItem id={self.id} order_id={self.order_id} product_id={self.product_id} qty={self.quantity}>"
