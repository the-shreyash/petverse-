import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { subscribeToEvents } from "@/utils/events";

// Maps backend notification `type` + `entity_type` into a UI category the
// Notification Center filters on (health / ai / community / shop / adoption / system).
const categoryFor = (n) => {
  const et = (n.entity_type || "").toLowerCase();
  if (et.includes("adopt")) return "adoption";
  if (et.includes("order") || et.includes("cart") || et.includes("product") || et.includes("shop")) return "shop";
  if (et.includes("appointment") || et.includes("vaccination") || et.includes("medication") || et.includes("health")) return "health";
  if (et.includes("ai")) return "ai";
  const t = (n.type || "").toUpperCase();
  if (t === "SOCIAL") return "community";
  if (t === "COMMERCE") return "shop";
  if (t === "REMINDER") return "health";
  return "system";
};

const mapNotification = (n) => ({
  id: n.id,
  type: (n.type || "system").toLowerCase(),
  title: n.title,
  description: n.body || n.message || "",
  priority: (n.priority || "low").toLowerCase(),
  category: categoryFor(n),
  timestamp: n.created_at,
  isRead: n.status === "READ" || n.read_at != null,
  icon: "Bell",
  action: n.action_url || null
});

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/notifications?limit=100");
      const raw = response.data || [];
      const mapped = raw.map(mapNotification);
      setNotifications(mapped);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Subscribe to Event Bus to reactively update
    const unsubscribe = subscribeToEvents(() => {
      fetchNotifications();
    });

    return () => unsubscribe();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id) => {
    try {
      await api.post(`/notifications/read/${id}`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await api.post("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const deleteNotification = useCallback(async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead,
    deleteNotification,
    loading,
    refresh: fetchNotifications
  };
}

export default useNotifications;
