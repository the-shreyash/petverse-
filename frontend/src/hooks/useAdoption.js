import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { publishEvent } from "@/utils/events";

export function useAdoption() {
  const [adoptablePets, setAdoptablePets] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  // Proximity filter state; null radius means "no distance limit".
  const [origin, setOrigin] = useState(null); // { latitude, longitude }
  const [radiusKm, setRadiusKm] = useState(null);

  const fetchListings = useCallback(async (opts = {}) => {
    const { latitude, longitude } = opts.origin ?? origin ?? {};
    const radius = opts.radiusKm !== undefined ? opts.radiusKm : radiusKm;

    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: "100" });
      if (latitude != null && longitude != null) {
        params.set("lat", latitude);
        params.set("lng", longitude);
        if (radius) params.set("radius_km", radius);
      }
      const response = await api.get(`/adoption?${params.toString()}`);
      setAdoptablePets(response.data || []);
    } catch (err) {
      console.error("Failed to fetch adoption listings", err);
      setAdoptablePets([]);
    } finally {
      setLoading(false);
    }
  }, [origin, radiusKm]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  /** Re-query sorted by distance from the given coordinates. */
  const applyNearbyFilter = useCallback(async (coords, radius = null) => {
    setOrigin(coords);
    setRadiusKm(radius);
    await fetchListings({ origin: coords, radiusKm: radius });
  }, [fetchListings]);

  const clearNearbyFilter = useCallback(async () => {
    setOrigin(null);
    setRadiusKm(null);
    await fetchListings({ origin: null, radiusKm: null });
  }, [fetchListings]);

  const fetchIncomingRequests = useCallback(async () => {
    try {
      const { data } = await api.get("/adoption/requests/incoming");
      setIncomingRequests(data || []);
    } catch (err) {
      console.error("Failed to load incoming adoption requests", err);
      setIncomingRequests([]);
    }
  }, []);

  const fetchMyRequests = useCallback(async () => {
    try {
      const { data } = await api.get("/adoption/requests/mine");
      setMyRequests(data || []);
    } catch (err) {
      console.error("Failed to load my adoption requests", err);
      setMyRequests([]);
    }
  }, []);

  const respondToRequest = useCallback(async (requestId, accept) => {
    const { data } = await api.post(
      `/adoption/requests/${requestId}/${accept ? "accept" : "reject"}`
    );
    await Promise.all([fetchIncomingRequests(), fetchListings()]);
    return data;
  }, [fetchIncomingRequests, fetchListings]);

  const addPetForAdoption = useCallback(async (listingData) => {
    try {
      const response = await api.post("/adoption", {
        title: listingData.title || `${listingData.pet_name} for Adoption`,
        description: listingData.description || listingData.reason,
        pet_id: listingData.pet_id,
        adoption_fee: listingData.adoption_fee || 0,
        city: listingData.city || null,
        state: listingData.state || null,
        country: listingData.country || null,
        latitude: listingData.latitude ?? null,
        longitude: listingData.longitude ?? null,
        gallery: listingData.gallery || []
      });

      publishEvent({
        type: "ADOPTION_LISTED",
        category: "community",
        title: "Adoption Listing Created",
        description: `Your pet adoption listing has been published.`,
        priority: "medium",
        action: "/adoption"
      });

      await fetchListings();
      return response.data;
    } catch (err) {
      console.error("Failed to create adoption listing", err);
      throw err;
    }
  }, [fetchListings]);

  const fetchListingDetail = useCallback(async (listingId) => {
    const response = await api.get(`/adoption/${listingId}`);
    return response.data;
  }, []);

  const submitApplication = useCallback(async (listingId, applicationData) => {
    try {
      const response = await api.post(`/adoption/${listingId}/apply`, applicationData);
      publishEvent({
        type: "ADOPTION_APPLIED",
        category: "community",
        title: "Adoption Application Submitted",
        description: "Your application has been submitted. The owner will be notified.",
        priority: "medium",
        action: "/adoption"
      });
      return response.data;
    } catch (err) {
      console.error("Failed to submit application", err);
      throw err;
    }
  }, []);

  const favoritePet = useCallback(async (listingId) => {
    try {
      await api.post(`/adoption/${listingId}/favorite`);
    } catch (err) {
      // Silently ignore - could be not implemented
      console.error("Failed to favorite pet", err);
    }
  }, []);

  const deleteListing = useCallback(async (listingId) => {
    try {
      await api.delete(`/adoption/${listingId}`);
      await fetchListings();
    } catch (err) {
      console.error("Failed to delete listing", err);
      throw err;
    }
  }, [fetchListings]);

  return {
    adoptablePets,
    shelters,
    loading,
    origin,
    radiusKm,
    incomingRequests,
    myRequests,
    addPetForAdoption,
    submitApplication,
    favoritePet,
    deleteListing,
    fetchListingDetail,
    applyNearbyFilter,
    clearNearbyFilter,
    fetchIncomingRequests,
    fetchMyRequests,
    respondToRequest,
    refresh: fetchListings
  };
}
