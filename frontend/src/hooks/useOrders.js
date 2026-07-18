import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // Fetch orders and the product catalog together so we can enrich
      // order items (which only carry product_id) with name/price/image.
      const [ordersRes, productsRes] = await Promise.all([
        api.get("/shop/orders"),
        api.get("/shop/products?limit=200")
      ]);

      const productMap = {};
      (productsRes.data || []).forEach((p) => { productMap[p.id] = p; });

      const mapped = (ordersRes.data || []).map((o) => ({
        id: o.id,
        status: o.status || "Processing",
        date: o.created_at ? new Date(o.created_at).toLocaleDateString() : "",
        total: o.total_amount ?? o.total ?? 0,
        tax: o.tax_amount ?? 0,
        items: (o.items || []).map((it) => ({
          id: it.id,
          quantity: it.quantity,
          price: it.price_at_purchase ?? it.price ?? 0,
          product: productMap[it.product_id] || { id: it.product_id, name: "Product" }
        }))
      }));
      setOrders(mapped);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, refresh: fetchOrders };
}

export default useOrders;
