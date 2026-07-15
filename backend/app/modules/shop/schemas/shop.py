"""
app/modules/shop/schemas/shop.py

Pydantic schemas for the Commerce Engine.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from app.core.schema import PetVerseBaseModel
from app.modules.shop.models.order import OrderStatus


# ─── Products & Categories ──────────────────────────────────────────────────
class CategorySchema(PetVerseBaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str]
    parent_id: Optional[str]


class ProductSchema(PetVerseBaseModel):
    id: str
    name: str
    brand: Optional[str]
    description: Optional[str]
    category_id: str
    price: float
    discount: Optional[float]
    stock: int
    rating: Optional[float]
    
    ingredients: Optional[Dict[str, Any]]
    nutrition: Optional[Dict[str, Any]]
    pet_types: Optional[List[str]]
    breed_support: Optional[List[str]]
    age_support: Optional[Dict[str, Any]]
    medical_tags: Optional[List[str]]


# ─── Cart ───────────────────────────────────────────────────────────────────
class CartItemSchema(PetVerseBaseModel):
    id: str
    product: ProductSchema
    quantity: int


class CartSchema(PetVerseBaseModel):
    id: str
    user_id: str
    items: List[CartItemSchema]
    
    @property
    def total_price(self) -> float:
        return sum(item.product.price * item.quantity for item in self.items)


class CartAddRequest(PetVerseBaseModel):
    product_id: str
    quantity: int = Field(default=1, ge=1)


# ─── Order ──────────────────────────────────────────────────────────────────
class OrderItemSchema(PetVerseBaseModel):
    id: str
    product_id: str
    quantity: int
    price_at_purchase: float


class OrderSchema(PetVerseBaseModel):
    id: str
    user_id: str
    status: OrderStatus
    total_amount: float
    tax_amount: float
    items: List[OrderItemSchema]
    created_at: datetime


class OrderCreateRequest(PetVerseBaseModel):
    cart_id: str


# ─── Wishlist ───────────────────────────────────────────────────────────────
class WishlistAddRequest(PetVerseBaseModel):
    product_id: str


class WishlistItemSchema(PetVerseBaseModel):
    id: str
    product: ProductSchema


class WishlistSchema(PetVerseBaseModel):
    id: str
    user_id: str
    items: List[WishlistItemSchema]
