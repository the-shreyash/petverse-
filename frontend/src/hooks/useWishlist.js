import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";

/**
 * useWishlist
 * Manages product wishlist via the FastAPI shop backend.
 * Stores wishlist locally for instant UI, syncs with server.
 */
export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      // Try wishlist endpoint — if not implemented, fall back to localStorage
      const response = await api.get("/shop/wishlist");
      const raw = response.data?.items || response.data || [];
      // Server items look like { id: <wishlistItemId>, product: {...} }.
      // Normalize to product-shaped entries so membership checks (by product id)
      // and product cards both work off a single consistent shape.
      const normalized = raw.map((it) =>
        it.product
          ? { ...it.product, id: it.product.id, product_id: it.product.id, wishlistItemId: it.id }
          : it
      );
      setWishlist(normalized);
    } catch (err) {
      if (err?.response?.status === 404) {
        // Wishlist endpoint not yet implemented — use localStorage
        try {
          const stored = localStorage.getItem("petverse_wishlist");
          if (stored) setWishlist(JSON.parse(stored));
        } catch (e) {}
      } else {
        console.error("Failed to load wishlist", err);
        // Fallback to localStorage
        try {
          const stored = localStorage.getItem("petverse_wishlist");
          if (stored) setWishlist(JSON.parse(stored));
        } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = useCallback(async (product) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const isInList = wishlist.some(
      item => (item.product_id || item.id) === (product.id || product.product_id)
    );

    // Optimistic update
    let updated;
    if (isInList) {
      updated = wishlist.filter(
        item => (item.product_id || item.id) !== (product.id || product.product_id)
      );
    } else {
      updated = [...wishlist, { ...product, product_id: product.id, id: product.id }];
    }
    setWishlist(updated);
    localStorage.setItem("petverse_wishlist", JSON.stringify(updated));

    // Attempt server sync
    try {
      if (isInList) {
        await api.delete(`/shop/wishlist/${product.id}`);
      } else {
        await api.post("/shop/wishlist", { product_id: product.id });
      }
    } catch (err) {
      // Non-critical: wishlist endpoint may not be implemented, localStorage is fine
      if (err?.response?.status !== 404 && err?.response?.status !== 405) {
        console.error("Wishlist sync failed", err);
      }
    }
  }, [wishlist]);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some(
      item => (item.product_id || item.id) === productId
    );
  }, [wishlist]);

  return {
    wishlist,
    toggleWishlist,
    isInWishlist,
    loading,
    refresh: fetchWishlist
  };
}
