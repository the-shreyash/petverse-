import React from "react";
import { productImage } from "@/utils/shopImage";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, ShoppingBag, Sparkles } from "lucide-react";
import PriceTag from "../shared/PriceTag";
import StockBadge from "../shared/StockBadge";

export default function ProductCard({
  product,
  isWishlisted = false,
  onWishlistToggle = () => {},
  onAddToCart = () => {}
}) {
  if (!product) return null;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle(product);
  };

  const handleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  // AI Match Score styling
  const matchColor = product.aiMatchScore >= 90
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : product.aiMatchScore >= 75
      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
      : "bg-slate-50 text-slate-500 border-slate-200";

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 16px 40px -8px rgba(0,0,0,0.06)" }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-slate-300 transition-all h-full"
    >
      {/* Top badges & Wishlist */}
      <div className="absolute inset-x-0 top-3 z-10 flex items-start justify-between px-3">
        {/* AI Match pill */}
        {product.aiMatchScore > 0 ? (
          <div className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm ${matchColor}`}>
            <Sparkles size={9} className="text-amber-500 animate-pulse" />
            <span>{product.aiMatchScore}% AI Match</span>
          </div>
        ) : (
          <div />
        )}

        {/* Wishlist toggle */}
        <button
          onClick={handleWishlist}
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white/90 backdrop-blur shadow-sm transition hover:scale-105 ${
            isWishlisted ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
          }`}
        >
          <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Image Link */}
      <Link to={`/shop/product/${product.id}`} className="relative block pt-[80%] bg-slate-50 overflow-hidden">
        <img
          src={productImage(product)}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
        />
      </Link>

      {/* Details content */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-3.5">
        <div className="space-y-1.5">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-slate-400">
            <span>{product.brand}</span>
            <span>·</span>
            <span>{product.category}</span>
          </div>

          {/* Title */}
          <Link to={`/shop/product/${product.id}`} className="block">
            <h4 className="text-xs font-black text-slate-800 line-clamp-2 leading-snug group-hover:text-slate-900 transition-colors">
              {product.name}
            </h4>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-black text-slate-700">{product.rating}</span>
            {product.reviews?.length > 0 && (
              <span className="text-[9px] font-semibold text-slate-400">({product.reviews.length})</span>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-50 pt-3">
          <div className="space-y-1">
            <PriceTag price={product.price} discount={product.discount} size="sm" />
            <StockBadge stock={product.stock} />
          </div>

          <button
            onClick={handleCart}
            disabled={product.stock <= 0}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800 disabled:opacity-40"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
