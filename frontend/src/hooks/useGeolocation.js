import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "petverse_location";

/**
 * useGeolocation
 *
 * Wraps navigator.geolocation with an explicit manual fallback: a denied
 * permission is a normal outcome, not an error state, so the caller can still
 * offer city entry. The last known position is cached so the browser prompt is
 * not re-triggered on every page load.
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | prompting | granted | denied | unavailable
  const [error, setError] = useState(null);

  // Restore any previously resolved location.
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.latitude != null && parsed?.longitude != null) {
          setCoords(parsed);
          setStatus(parsed.manual ? "manual" : "granted");
        }
      }
    } catch {
      /* ignore corrupt cache */
    }
  }, []);

  const persist = useCallback((value) => {
    setCoords(value);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      /* storage full or blocked — non-fatal */
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      setError("This browser does not support location services.");
      return Promise.resolve(null);
    }

    setStatus("prompting");
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            manual: false,
          };
          persist(value);
          setStatus("granted");
          setError(null);
          resolve(value);
        },
        (err) => {
          setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable");
          setError(
            err.code === err.PERMISSION_DENIED
              ? "Location permission denied. You can enter a city instead."
              : "Could not determine your location. You can enter a city instead."
          );
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
      );
    });
  }, [persist]);

  /** Manual entry fallback when permission is denied or unavailable. */
  const setManualLocation = useCallback((latitude, longitude, city = null) => {
    const value = { latitude, longitude, city, manual: true };
    persist(value);
    setStatus("manual");
    setError(null);
    return value;
  }, [persist]);

  const clearLocation = useCallback(() => {
    setCoords(null);
    setStatus("idle");
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    coords,
    status,
    error,
    hasLocation: !!coords,
    requestLocation,
    setManualLocation,
    clearLocation,
  };
}
