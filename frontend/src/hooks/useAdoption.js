import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { publishEvent } from "@/utils/events";

export function useAdoption() {
  const [adoptablePets, setAdoptablePets] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/adoption?limit=100");
      const listings = response.data || [];
      setAdoptablePets(listings);
    } catch (err) {
      console.error("Failed to fetch adoption listings", err);
      setAdoptablePets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

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
    addPetForAdoption,
    submitApplication,
    favoritePet,
    deleteListing,
    fetchListingDetail,
    refresh: fetchListings
  };
}
