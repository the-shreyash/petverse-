import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, Star, Search, Heart, ShoppingCart, SlidersHorizontal, Bot } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAIContext } from "@/hooks/useAIContext";

// Shop Components
import ProductCard from "@/components/shop/cards/ProductCard";
import ShopRecommendationCard from "@/components/shop/cards/RecommendationCard";
import CategoryFilter from "@/components/shop/filters/CategoryFilter";
import PriceFilter from "@/components/shop/filters/PriceFilter";
import RatingFilter from "@/components/shop/filters/RatingFilter";
import HealthHeader from "@/components/health/shared/HealthHeader";

export default function ShopHome() {
  const navigate = useNavigate();
  const { activePet, healthDomain } = useAIContext();
  const { pets, selectedPetId, changeSelectedPet } = healthDomain;

  const {
    filteredProducts,
    aiRecommendations,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating
  } = useProducts();

  const { addToCart, cart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const totalCartItems = cart.reduce((s, item) => s + item.quantity, 0);

  return (
    <DashboardLayout
      pageTitle="Smart Pet Shop"
      pageDescription="AI-personalized shopping experience tailors recommendations to your pet's exact biological needs."
    >
      <div className="space-y-8">
        {/* Header with Pet selector + Cart/Wishlist shortcuts */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <HealthHeader
              pets={pets}
              selectedPetId={selectedPetId}
              onChangePet={changeSelectedPet}
              accentColor="emerald"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/shop/wishlist"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-rose-500 transition shadow-sm"
            >
              <Heart size={18} />
            </Link>
            
            <Link
              to="/shop/cart"
              className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-slate-600 hover:border-slate-300 transition shadow-sm font-bold text-xs"
            >
              <ShoppingCart size={16} className="text-emerald-500" />
              <span>Cart ({totalCartItems})</span>
            </Link>

            <Link
              to="/shop/orders"
              className="flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-5 text-xs font-black text-white hover:bg-slate-800 shadow-md transition"
            >
              Order History
            </Link>
          </div>
        </div>

        {/* AI Recommendations Banner Carousel */}
        {activePet && aiRecommendations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-500" />
                <span>AI Recommended for {activePet.name}</span>
              </h3>
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
                <Bot size={11} />
                <span>Personalized Catalog</span>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {aiRecommendations.slice(0, 3).map((prod) => (
                <ShopRecommendationCard
                  key={prod.id}
                  product={prod}
                  reasoning={
                    // The API returns category_id, not a category name — reading
                    // `.category` directly threw and white-screened the page.
                    `${prod.category || prod.category_name || ""}`.includes("Food")
                      ? `Targeted nutrition matches ${activePet?.name || "your pet"}'s breed lifecycle requirements.`
                      : `Highly recommended for joint structure and general wellness of ${activePet?.breed || "your pet"}s.`
                  }
                  onAddToCart={(p) => addToCart(p, 1)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute top-3.5 left-4 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search dog food, toys, medications, shampoo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-emerald-400 bg-white transition shadow-sm"
              />
            </div>
          </div>

          <CategoryFilter active={selectedCategory} onChange={setSelectedCategory} />
        </div>

        {/* Shop Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left panel: Filters sidebar */}
          <div className="lg:col-span-3 space-y-5">
            <PriceFilter maxPrice={maxPrice} onChange={setMaxPrice} />
            <RatingFilter activeRating={minRating} onChange={setMinRating} />
            
            {/* Promo banner */}
            <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/40 via-white to-white p-5 space-y-2 shadow-sm text-center">
              <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700">
                PROMO
              </span>
              <h4 className="font-black text-slate-800 text-sm">Save 10% on first checkout</h4>
              <p className="text-[11px] font-semibold text-slate-400 leading-relaxed">
                Use promo code <strong className="text-slate-600">PETVERSE10</strong> at payment review.
              </p>
            </div>
          </div>

          {/* Right panel: Product catalog */}
          <div className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((prod) => (
                  <div key={prod.id}>
                    <ProductCard
                      product={prod}
                      isWishlisted={isInWishlist(prod.id)}
                      onWishlistToggle={toggleWishlist}
                      onAddToCart={(p) => addToCart(p, 1)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[30px] border border-dashed border-slate-200 p-16 text-center bg-white">
                <SlidersHorizontal className="mx-auto mb-4 text-slate-300" size={32} />
                <h3 className="text-lg font-black text-slate-700">No matching products found</h3>
                <p className="text-sm font-semibold text-slate-400 mt-1">
                  Adjust filters, price range, or search keywords and try again.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setMaxPrice(150);
                    setMinRating(0);
                  }}
                  className="mt-5 inline-flex items-center justify-center gap-1 text-xs font-black text-emerald-600 hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
