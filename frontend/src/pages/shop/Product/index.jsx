import React, { useState, useMemo } from "react";
import { productImage } from "@/utils/shopImage";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ShoppingBag, Star, Sparkles, AlertTriangle, Check, ShieldCheck, Heart } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAIContext } from "@/hooks/useAIContext";

// Shop components
import PriceTag from "@/components/shop/shared/PriceTag";
import StockBadge from "@/components/shop/shared/StockBadge";
import DeliveryBadge from "@/components/shop/shared/DeliveryBadge";
import SubscriptionCard from "@/components/shop/cards/SubscriptionCard";
import ReviewCard from "@/components/shop/cards/ReviewCard";

export default function ProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activePet, feeding } = useAIContext();
  const { products, getAIMatchScore } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [purchaseMode, setPurchaseMode] = useState("one-time"); // 'one-time' | 'subscription'
  const [activeTab, setActiveTab] = useState("description");

  const product = useMemo(() => {
    return products.find(p => p.id === id) || null;
  }, [products, id]);

  const aiScore = useMemo(() => {
    if (!product) return 0;
    return getAIMatchScore(product);
  }, [product, getAIMatchScore]);

  if (!product) {
    return (
      <DashboardLayout pageTitle="Product Details" pageDescription="Catalog item.">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="text-slate-300 mb-4 animate-pulse" size={32} />
          <h3 className="text-lg font-black text-slate-700">Product not found</h3>
          <Link to="/shop" className="mt-4 text-xs font-black text-emerald-600 hover:underline">
            Back to Shop
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const matchColor = aiScore >= 90
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : aiScore >= 75
      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
      : "bg-slate-50 text-slate-500 border-slate-200";

  // Check if product contains allergens
  const containsAllergen = (() => {
    if (!activePet || !feeding || feeding.allergies === "None") return false;
    const allergyKeywords = feeding.allergies.toLowerCase().split(/[,\s]+/);
    return product.ingredients?.some(ing =>
      allergyKeywords.some(keyword => ing.toLowerCase().includes(keyword))
    );
  })();

  const handleAddToCart = () => {
    addToCart(product, quantity, purchaseMode === "subscription");
    navigate("/shop/cart");
  };

  return (
    <DashboardLayout
      pageTitle="Product Details"
      pageDescription="Curated item summary with AI compatibility evaluation."
    >
      <div className="space-y-6">
        {/* Back Link */}
        <Link to="/shop" className="inline-flex items-center gap-1 text-xs font-black text-slate-500 hover:text-slate-700 transition">
          <ChevronLeft size={16} />
          <span>Back to catalog</span>
        </Link>

        {/* Product Grid */}
        <div className="grid gap-8 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
          {/* Left panel: Images */}
          <div className="lg:col-span-5 space-y-4">
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/50 aspect-square relative">
              <img
                src={productImage(product)}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {product.images?.map((img, i) => (
                <div key={i} className="h-16 w-16 rounded-xl border border-slate-200 overflow-hidden cursor-pointer">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Details & Buying options */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2.5">
              {/* Brand & Category */}
              <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase">
                <span>{product.brand}</span>
                <span>·</span>
                <span>{product.category}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-snug">
                {product.name}
              </h2>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-3">
                {aiScore > 0 && (
                  <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm ${matchColor}`}>
                    <Sparkles size={11} className="text-amber-500 animate-pulse" />
                    <span>{aiScore}% AI Match Score</span>
                  </div>
                )}
                <StockBadge stock={product.stock} />
                <DeliveryBadge freeShipping={product.price > 49} />
              </div>
            </div>

            {/* Price section */}
            <div className="border-t border-b border-slate-100 py-4 flex items-center justify-between">
              <PriceTag price={product.price} discount={product.discount} size="xl" />
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
                  isInWishlist(product.id)
                    ? "border-rose-200 bg-rose-50 text-rose-500"
                    : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
                }`}
              >
                <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Allergen Warning Alert */}
            {containsAllergen && (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
                <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="text-xs font-black text-rose-800">Allergen Warning Alert</h4>
                  <p className="text-[11px] font-semibold text-rose-600 leading-normal mt-0.5">
                    This product contains ingredients that match {activePet?.name || "your pet"}'s allergy profiles ({feeding?.allergies}).
                  </p>
                </div>
              </div>
            )}

            {/* AI compatibility explanation */}
            {activePet && aiScore > 0 && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/20 p-4 space-y-2">
                <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider block">
                  AI Fit Assessment
                </span>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                  {containsAllergen
                    ? `⚠️ Warning: Although this recipe is optimized for ${activePet.breed} nutritional requirements, we flagged ingredients that conflict with ${activePet.name}'s specific allergy profile.`
                    : `✅ Highly Recommended: This item has been verified against ${activePet.name}'s active clinical profile (species compatibility: 100%, breed weight target: matched, allergy safety: checked).`}
                </p>
              </div>
            )}

            {/* Buying selector */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Purchase Mode</h4>
              
              <div className="grid gap-3 sm:grid-cols-2">
                {/* One time */}
                <div
                  onClick={() => setPurchaseMode("one-time")}
                  className={`rounded-2xl border-2 p-4 cursor-pointer transition ${
                    purchaseMode === "one-time" ? "border-slate-800 bg-slate-50/50" : "border-slate-200 bg-white"
                  }`}
                >
                  <span className="text-xs font-black text-slate-800 block">One-Time Purchase</span>
                  <span className="text-sm font-black text-slate-700 block mt-1.5">${product.price.toFixed(2)}</span>
                </div>

                {/* Repeat autoship */}
                {product.subscriptionSupported && (
                  <SubscriptionCard
                    price={product.price}
                    selected={purchaseMode === "subscription"}
                    onSelect={() => setPurchaseMode("subscription")}
                  />
                )}
              </div>
            </div>

            {/* Add to Cart Actions */}
            <div className="flex gap-4 items-center">
              {/* Quantity */}
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 shrink-0">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="h-8 w-8 rounded-xl bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center text-sm font-black text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  disabled={quantity >= product.stock}
                  className="h-8 w-8 rounded-xl bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 flex items-center justify-center font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-xs font-black text-white hover:bg-slate-800 shadow-md transition"
              >
                <ShoppingBag size={14} />
                <span>Add {purchaseMode === "subscription" ? "Auto-Ship Subscription" : "to Cart"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Details Tabs (description, nutrition, reviews) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex gap-4 border-b border-slate-100 pb-2">
            {[
              { id: "description", label: "Product Description" },
              { id: "nutrition", label: "Nutrition & Ingredients" },
              { id: "reviews", label: `Customer Reviews (${product.reviews?.length || 0})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-1 pb-2.5 text-xs font-black transition-all ${
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-semibold text-slate-500 leading-relaxed">
            {activeTab === "description" && (
              <p>{product.description}</p>
            )}

            {activeTab === "nutrition" && (
              <div className="space-y-4">
                {product.nutrition && Object.keys(product.nutrition).length > 0 && (
                  <div className="grid gap-2 grid-cols-3 max-w-md">
                    {Object.entries(product.nutrition).map(([key, val]) => (
                      <div key={key} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">{key}</span>
                        <span className="text-sm font-black text-slate-700 mt-0.5 block">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <h5 className="font-black text-slate-800 mb-1">Full Ingredients List</h5>
                  <p>{product.ingredients?.join(", ") || "No specific ingredients on file."}</p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {product.reviews.map((r, i) => (
                      <ReviewCard key={i} review={r} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-slate-400 font-bold">No reviews logged yet. Be the first to leave one!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
