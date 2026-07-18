import React from "react";
import { productImage } from "@/utils/shopImage";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, Calendar } from "lucide-react";
import PriceTag from "../shared/PriceTag";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  if (!item) return null;

  const { product, quantity, isSubscription } = item;

  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Product Image + Details */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <img
          src={productImage(product)}
          alt={product.name}
          className="h-16 w-16 rounded-2xl object-cover border border-slate-100 shrink-0"
        />
        <div className="min-w-0">
          <Link to={`/shop/product/${product.id}`} className="block text-xs font-black text-slate-800 hover:underline truncate">
            {product.name}
          </Link>
          
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <PriceTag price={product.price} discount={product.discount} size="xs" />
            {isSubscription && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 text-[9px] font-black uppercase text-emerald-700">
                <Calendar size={9} />
                <span>Auto-Ship</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity & Delete actions */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Quantity controller */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => onUpdateQuantity(product.id, isSubscription, -1)}
            className="flex h-6 w-6 items-center justify-center rounded-lg hover:bg-white text-slate-500 hover:text-slate-700 transition"
          >
            <Minus size={11} />
          </button>
          <span className="w-5 text-center text-xs font-extrabold text-slate-800">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(product.id, isSubscription, 1)}
            disabled={quantity >= product.stock}
            className="flex h-6 w-6 items-center justify-center rounded-lg hover:bg-white text-slate-500 hover:text-slate-700 transition disabled:opacity-40"
          >
            <Plus size={11} />
          </button>
        </div>

        {/* Delete */}
        <button
          onClick={() => onRemove(product.id, isSubscription)}
          className="text-slate-400 hover:text-rose-500 transition p-1"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
