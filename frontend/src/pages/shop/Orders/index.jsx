import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Calendar, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import { useOrders } from "@/hooks/useOrders";
import { productImage } from "@/utils/shopImage";

export default function OrderHistory() {
  const { orders, loading } = useOrders();

  return (
    <DashboardLayout
      pageTitle="Order History"
      pageDescription="View past transactions, check order status, and manage subscriptions."
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Link */}
        <Link to="/shop" className="inline-flex items-center gap-1 text-xs font-black text-slate-500 hover:text-slate-700 transition">
          <ChevronLeft size={16} />
          <span>Back to shop</span>
        </Link>

        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-40 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((ord) => (
              <motion.div
                key={ord.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                    <div>
                      <span>Order:</span>
                      <span className="text-slate-800 font-extrabold ml-1 uppercase">{ord.id.substring(0, 10)}</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{ord.date}</span>
                    </div>
                  </div>
                  
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9px] font-black uppercase text-emerald-700 border border-emerald-100 flex items-center gap-1">
                    <CheckCircle size={10} />
                    <span>{ord.status || "Processing"}</span>
                  </span>
                </div>

                {/* Items preview list */}
                <div className="space-y-3">
                  {ord.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-xs items-center">
                      <img
                        src={productImage(item.product)}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-700 truncate leading-tight">{item.product.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span className="font-black text-slate-800 shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total amount footer summary */}
                <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline text-xs font-semibold text-slate-500">
                  <span>Total Amount Paid</span>
                  <span className="text-sm font-black text-slate-800">${Number(ord.total || 0).toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-[30px] border border-dashed border-slate-200 p-20 text-center bg-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 mx-auto mb-4">
              <FileText className="text-slate-300" size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-700">No past orders found</h3>
            <p className="text-sm font-semibold text-slate-400 mt-1">
              You haven't completed any checkouts yet. Visit the catalog to get started.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
