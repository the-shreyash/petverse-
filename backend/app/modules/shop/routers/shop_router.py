"""
app/modules/shop/routers/shop_router.py

FastAPI router for Commerce Engine endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database.engine import get_db
from app.modules.shop.schemas.shop import (
    ProductSchema, CategorySchema, CartSchema, CartAddRequest, 
    OrderSchema, OrderCreateRequest, WishlistSchema, WishlistAddRequest
)
from app.modules.shop.services.product_service import ProductService
from app.modules.shop.services.cart_service import CartService
from app.modules.shop.services.order_service import OrderService
from app.modules.shop.services.recommendation_service import RecommendationService


router = APIRouter()

# Simulated auth dependency
from fastapi import Header
async def get_current_user_id(x_user_id: str = Header(..., description="Simulated Auth User ID")) -> str:
    return x_user_id


# ─── Products & Categories ──────────────────────────────────────────────────

@router.get("/categories", response_model=List[CategorySchema])
async def get_categories(session: AsyncSession = Depends(get_db)):
    service = ProductService(session)
    return await service.get_all_categories()

@router.get("/products", response_model=List[ProductSchema])
async def get_products(skip: int = 0, limit: int = 100, session: AsyncSession = Depends(get_db)):
    service = ProductService(session)
    return await service.get_products(skip, limit)

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
async def get_cart(user_id: str = Depends(get_current_user_id), session: AsyncSession = Depends(get_db)):
    service = CartService(session)
    return await service.get_or_create_cart(user_id)

@router.post("/cart", response_model=CartSchema)
async def add_to_cart(request: CartAddRequest, user_id: str = Depends(get_current_user_id), session: AsyncSession = Depends(get_db)):
    service = CartService(session)
    return await service.add_item(user_id, request.product_id, request.quantity)

@router.delete("/cart/{item_id}", response_model=CartSchema)
async def remove_from_cart(item_id: str, user_id: str = Depends(get_current_user_id), session: AsyncSession = Depends(get_db)):
    service = CartService(session)
    return await service.remove_item(user_id, item_id)


# ─── Orders ─────────────────────────────────────────────────────────────────

@router.get("/orders", response_model=List[OrderSchema])
async def get_orders(user_id: str = Depends(get_current_user_id), session: AsyncSession = Depends(get_db)):
    service = OrderService(session)
    return await service.get_user_orders(user_id)

@router.post("/orders", response_model=OrderSchema)
async def create_order(request: OrderCreateRequest, user_id: str = Depends(get_current_user_id), session: AsyncSession = Depends(get_db)):
    # request.cart_id is ignored in this simple implementation, we just checkout the user's active cart
    service = OrderService(session)
    return await service.create_order_from_cart(user_id)


# ─── Recommendations ────────────────────────────────────────────────────────

@router.get("/recommendations", response_model=List[ProductSchema])
async def get_recommendations(pet_id: str, user_id: str = Depends(get_current_user_id), session: AsyncSession = Depends(get_db)):
    service = RecommendationService(session)
    return await service.get_recommended_products(user_id, pet_id)
