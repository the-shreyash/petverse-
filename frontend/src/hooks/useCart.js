import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { publishEvent } from "@/utils/events";

export function useCart() {
  const [cart, setCart] = useState({ items: [], id: null });
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await api.get("/shop/cart");
      setCart(res.data || { items: [], id: null });
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartItems = cart.items || [];

  const addToCart = useCallback(async (product, quantity = 1) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await api.post("/shop/cart", { product_id: product.id, quantity });
      await fetchCart();
      publishEvent({
        type: "CART_UPDATED",
        category: "shop",
        title: "Added to Cart",
        description: `${product.name} added to your cart.`,
        priority: "low",
        action: "/shop/cart"
      });
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  }, [fetchCart]);

  const removeFromCart = useCallback(async (itemId) => {
    try {
      await api.delete(`/shop/cart/${itemId}`);
      await fetchCart();
    } catch (err) {
      console.error("Failed to remove from cart", err);
    }
  }, [fetchCart]);

  const updateQuantity = useCallback(async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      return removeFromCart(itemId);
    }
    try {
      // Backend expects `quantity` as a query parameter, not a JSON body.
      await api.patch(`/shop/cart/${itemId}`, null, { params: { quantity: newQuantity } });
      await fetchCart();
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  }, [fetchCart, removeFromCart]);

  const applyCoupon = useCallback((code) => {
    setPromoCode(code);
    // Hardcoded promos until backend promo endpoint is wired
    if (code.toLowerCase() === "petverse10") {
      setDiscountPercent(10);
      return true;
    }
    if (code.toLowerCase() === "proactive20") {
      setDiscountPercent(20);
      return true;
    }
    setDiscountPercent(0);
    return false;
  }, []);

  const clearCart = useCallback(() => {
    setCart({ items: [], id: null });
    setPromoCode("");
    setDiscountPercent(0);
  }, []);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || item.price || 0;
    const qty = item.quantity || 1;
    return acc + price * qty;
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 49 ? 0 : 5.99;
  const total = subtotal - discountAmount + shipping;

  const checkoutOrder = useCallback(async (shippingDetails, paymentDetails) => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await api.post("/shop/orders", {
        shipping_address: shippingDetails,
        payment_method: paymentDetails?.method || "card",
        cart_id: cart.id
      });

      const order = response.data;

      publishEvent({
        type: "ORDER_PLACED",
        category: "shop",
        title: "Order Placed Successfully",
        description: `Your order has been received! Total: $${total.toFixed(2)}.`,
        priority: "medium",
        action: "/shop/orders"
      });

      clearCart();
      await fetchCart();
      return order;
    } catch (err) {
      console.error("Checkout failed", err);
      return null;
    }
  }, [cart, total, clearCart, fetchCart]);

  return {
    cart: cartItems,
    cartData: cart,
    promoCode,
    discountPercent,
    discountAmount,
    subtotal,
    shipping,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCart,
    checkoutOrder
  };
}
