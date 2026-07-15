"""
app/modules/shop/models/wishlist.py

Models for Wishlist and Wishlist Items.
"""

from __future__ import annotations

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Wishlist(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Wishlist owned by a User."""
    __tablename__ = "shop_wishlists"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False, unique=True)
    
    items: Mapped[list["WishlistItem"]] = relationship("WishlistItem", back_populates="wishlist", cascade="all, delete-orphan", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Wishlist id={self.id} user_id={self.user_id}>"


class WishlistItem(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """An individual item inside a Wishlist."""
    __tablename__ = "shop_wishlist_items"

    wishlist_id: Mapped[str] = mapped_column(String(36), ForeignKey("shop_wishlists.id", ondelete="CASCADE"), index=True, nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("shop_products.id", ondelete="CASCADE"), index=True, nullable=False)

    wishlist: Mapped["Wishlist"] = relationship("Wishlist", back_populates="items")
    product: Mapped["Product"] = relationship("Product", lazy="selectin") # type: ignore

    def __repr__(self) -> str:
        return f"<WishlistItem id={self.id} wishlist_id={self.wishlist_id} product_id={self.product_id}>"
