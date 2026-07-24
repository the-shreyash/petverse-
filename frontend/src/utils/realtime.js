/**
 * realtime.js — transport-agnostic realtime abstraction.
 *
 * The backend has no WebSocket endpoint yet. Rather than polling (which the
 * product spec rules out), this module exposes the subscribe/publish surface
 * that live updates will use, backed today by an in-process event bus so
 * same-tab actions still propagate instantly.
 *
 * When the server gains a WS endpoint, implement `connectRealtime()` below and
 * every existing subscriber starts receiving remote events with no call-site
 * changes.
 */

const listeners = new Map(); // channel -> Set<callback>
let socket = null;
let currentToken = null;

if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      disconnectRealtime();
    } else if (document.visibilityState === 'visible' && currentToken) {
      connectRealtime(currentToken);
    }
  });
}

export function subscribeToRealtime(channel, callback) {
  if (!listeners.has(channel)) listeners.set(channel, new Set());
  listeners.get(channel).add(callback);
  return () => {
    listeners.get(channel)?.delete(callback);
  };
}

/** Dispatch to local subscribers. Called by the socket handler and by optimistic UI. */
export function emitRealtime(channel, payload) {
  listeners.get(channel)?.forEach((cb) => {
    try {
      cb(payload);
    } catch (err) {
      console.error(`realtime handler failed for "${channel}"`, err);
    }
  });
}

/**
 * Open the WebSocket connection. No-op until the server exposes /ws.
 * Kept here so the connection lifecycle lives in one place.
 */
export function connectRealtime(token) {
  currentToken = token;
  const url = import.meta.env.VITE_WS_URL;
  if (!url || socket) return socket;

  try {
    socket = new WebSocket(`${url}?token=${encodeURIComponent(token)}`);
    socket.onmessage = (event) => {
      try {
        const { channel, payload } = JSON.parse(event.data);
        if (channel) emitRealtime(channel, payload);
      } catch {
        /* ignore malformed frames */
      }
    };
    socket.onclose = () => {
      socket = null;
    };
  } catch (err) {
    console.error("Realtime connection failed", err);
    socket = null;
  }
  return socket;
}

export function disconnectRealtime() {
  socket?.close();
  socket = null;
}
