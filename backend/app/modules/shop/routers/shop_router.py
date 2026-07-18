"""
app/modules/shop/routers/shop_router.py

FastAPI router for Commerce Engine endpoints.
Uses real JWT authentication via get_current_user dependency.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.database.engine import get_db
from app.dependencies.auth import get_current_user
from app.modules.user.models.user import User
from app.modules.shop.schemas.shop import (
    ProductSchema, CategorySchema, CartSchema, CartAddRequest,
    OrderSchema, OrderCreateRequest, WishlistSchema, WishlistAddRequest
)
from app.modules.shop.services.product_service import ProductService
from app.modules.shop.services.cart_service import CartService
from app.modules.shop.services.order_service import OrderService
from app.modules.shop.services.recommendation_service import RecommendationService
from app.modules.shop.services.wishlist_service import WishlistService


router = APIRouter()


# ─── Products & Categories ──────────────────────────────────────────────────

@router.get("/categories", response_model=List[CategorySchema])
async def get_categories(session: AsyncSession = Depends(get_db)):
    service = ProductService(session)
    return await service.get_all_categories()

@router.get("/products", response_model=List[ProductSchema])
async def get_products(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    session: AsyncSession = Depends(get_db)
):
    service = ProductService(session)
    return await service.get_products(skip, limit, category=category)

@router.get("/products/search", response_model=List[ProductSchema])
async def search_products(query: str, session: AsyncSession = Depends(get_db)):
    service = ProductService(session)
    return await service.search_products(query)

@router.get("/products/{product_id}", response_model=ProductSchema)
async def get_product(product_id: str, session: AsyncSession = Depends(get_db)):
    service = ProductService(session)
    product = await service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# ─── Cart ───────────────────────────────────────────────────────────────────

@router.get("/cart", response_model=CartSchema)
async def get_cart(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = CartService(session)
    return await service.get_or_create_cart(current_user.id)

@router.post("/cart", response_model=CartSchema)
async def add_to_cart(
    request: CartAddRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = CartService(session)
    return await service.add_item(current_user.id, request.product_id, request.quantity)

@router.patch("/cart/{item_id}", response_model=CartSchema)
async def update_cart_item(
    item_id: str,
    quantity: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = CartService(session)
    return await service.update_item_quantity(current_user.id, item_id, quantity)

@router.delete("/cart/{item_id}", response_model=CartSchema)
async def remove_from_cart(
    item_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = CartService(session)
    return await service.remove_item(current_user.id, item_id)


# ─── Orders ─────────────────────────────────────────────────────────────────

@router.get("/orders", response_model=List[OrderSchema])
async def get_orders(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = OrderService(session)
    return await service.get_user_orders(current_user.id)

@router.post("/orders", response_model=OrderSchema)
async def create_order(
    request: OrderCreateRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = OrderService(session)
    return await service.create_order_from_cart(current_user.id)


# ─── Wishlist ───────────────────────────────────────────────────────────────

@router.get("/wishlist", response_model=WishlistSchema)
async def get_wishlist(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = WishlistService(session)
    return await service.get_or_create_wishlist(current_user.id)

@router.post("/wishlist", response_model=WishlistSchema)
async def add_to_wishlist(
    request: WishlistAddRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = WishlistService(session)
    return await service.add_item(current_user.id, request.product_id)

@router.delete("/wishlist/{product_id}", response_model=WishlistSchema)
async def remove_from_wishlist(
    product_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = WishlistService(session)
    return await service.remove_by_product(current_user.id, product_id)


# ─── Recommendations ────────────────────────────────────────────────────────

@router.get("/recommendations", response_model=List[ProductSchema])
async def get_recommendations(
    pet_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    service = RecommendationService(session)
    return await service.get_recommended_products(current_user.id, pet_id)
