"""
app/modules/shop/models/product.py

Models for Product and Category in the E-commerce module.
"""

from __future__ import annotations
from typing import Optional

from sqlalchemy import ForeignKey, String, Text, Numeric, Boolean, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Category(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Product categories (e.g., Food, Toys, Accessories)."""
    __tablename__ = "shop_categories"

    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    
    # Optional parent category for hierarchical categories
    parent_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("shop_categories.id", ondelete="SET NULL"), nullable=True)
    
    subcategories: Mapped[list["Category"]] = relationship("Category", cascade="all", lazy="selectin")
    products: Mapped[list["Product"]] = relationship("Product", back_populates="category", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Category id={self.id} name={self.name}>"


class Product(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """E-commerce product, enriched with fields for AI recommendations."""
    __tablename__ = "shop_products"

    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    brand: Mapped[Optional[str]] = mapped_column(String(100), index=True, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    category_id: Mapped[str] = mapped_column(String(36), ForeignKey("shop_categories.id", ondelete="RESTRICT"), index=True, nullable=False)
    
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    discount: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), nullable=True) # Percentage e.g. 10.00
    stock: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    # e.g., 4.5
    rating: Mapped[Optional[float]] = mapped_column(Numeric(3, 2), nullable=True)
    
    # ─── AI Metadata ──────────────────────────────────────────────────────────
    # Fields used by the AI engine to recommend products
    
    ingredients: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    nutrition: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    # Supported species, e.g., ["Dog", "Cat"]
    pet_types: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True) 
    
    # Breeds supported, e.g., ["Golden Retriever", "Labrador"]
    breed_support: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True) 
    
    # e.g., {"min": 0, "max": 12, "unit": "months"}
    age_support: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True) 
    
    # e.g., ["diabetic", "sensitive_stomach", "joint_care"]
    medical_tags: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    # ─── Status ───────────────────────────────────────────────────────────────
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    category: Mapped["Category"] = relationship("Category", back_populates="products")

    def __repr__(self) -> str:
        return f"<Product id={self.id} name={self.name}>"
