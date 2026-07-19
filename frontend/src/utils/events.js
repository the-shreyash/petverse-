/**
 * events.js - Unified Client-Side Event Bus
 * 
 * publishEvent() stores events locally AND persists to backend notifications API.
 */

const STORAGE_KEY = "petverse_event_log";
const LISTENERS = new Set();

export function getStoredEvents() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredEvents(events) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {}
  }
}

/*
 * Note: this bus is deliberately client-local.
 *
 * It used to POST every event to /notifications, which 405'd on every call —
 * that route is read-only by design. Durable notifications are produced
 * server-side from domain events (see app/modules/notifications), which is the
 * authoritative source: it works across devices and cannot be forged by a
 * client. This bus only drives immediate in-tab UI feedback.
 */

export function publishEvent(eventData) {
  const newEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    isRead: false,
    priority: eventData.priority || "low",
    category: eventData.category || "system",
    ...eventData,
  };

  const currentEvents = getStoredEvents();
  const updatedEvents = [newEvent, ...currentEvents].slice(0, 200);
  saveStoredEvents(updatedEvents);

  // Notify internal React hook subscribers
  LISTENERS.forEach((callback) => {
    try {
      callback(newEvent, updatedEvents);
    } catch (e) {
      console.error("Error in event listener callback:", e);
    }
  });

  // Notify native browser elements
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("petverse-new-event", { detail: newEvent })
    );
  }

  return newEvent;
}

export function subscribeToEvents(callback) {
  LISTENERS.add(callback);
  return () => {
    LISTENERS.delete(callback);
  };
}

export function markEventAsRead(id) {
  const currentEvents = getStoredEvents();
  const updatedEvents = currentEvents.map((evt) =>
    evt.id === id ? { ...evt, isRead: true } : evt
  );
  saveStoredEvents(updatedEvents);
  LISTENERS.forEach((callback) => callback(null, updatedEvents));
}

export function markAllEventsAsRead() {
  const currentEvents = getStoredEvents();
  const updatedEvents = currentEvents.map((evt) => ({ ...evt, isRead: true }));
  saveStoredEvents(updatedEvents);
  LISTENERS.forEach((callback) => callback(null, updatedEvents));
}

export function deleteEvent(id) {
  const currentEvents = getStoredEvents();
  const updatedEvents = currentEvents.filter((evt) => evt.id !== id);
  saveStoredEvents(updatedEvents);
  LISTENERS.forEach((callback) => callback(null, updatedEvents));
}
