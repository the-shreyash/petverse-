import React from "react";
import { productImage } from "@/utils/shopImage";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import PriceTag from "../shared/PriceTag";

export default function ShopRecommendationCard({ product, reasoning = "", onAddToCart = () => {} }) {
  if (!product) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/20 via-white to-white p-5 shadow-sm flex flex-col justify-between space-y-4">
      <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
      
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700">
            <Sparkles size={9} className="text-amber-500 animate-pulse" />
            <span>AI Match Suggestion</span>
          </div>
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-100/50 rounded px-1.5 py-0.5">
            {product.aiMatchScore}% Match
          </span>
        </div>

        {/* Product details */}
        <div className="flex items-center gap-3">
          <img
            src={productImage(product)}
            alt={product.name}
            className="h-12 w-12 rounded-xl object-cover border border-slate-100"
          />
          <div className="flex-1 min-w-0">
            <Link to={`/shop/product/${product.id}`} className="block text-xs font-black text-slate-800 truncate hover:underline">
              {product.name}
            </Link>
            <PriceTag price={product.price} discount={product.discount} size="xs" />
          </div>
        </div>

        {/* Reasoning */}
        {reasoning && (
          <p className="text-[11px] font-semibold text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-xl">
            {reasoning}
          </p>
        )}
      </div>

      <button
        onClick={() => onAddToCart(product)}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
      >
        <span>Add to Cart</span>
        <ArrowRight size={12} />
      </button>
    </div>
  );
}
