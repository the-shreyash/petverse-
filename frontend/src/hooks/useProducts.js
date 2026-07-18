import { useMemo, useState, useEffect, useCallback } from "react";
import api from "@/services/api";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePet, setActivePet] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/shop/products?limit=100");
        setProducts(response.data || []);
      } catch (err) {
        console.error("Error fetching products", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Load active pet from localStorage for AI matching
  useEffect(() => {
    const petId = localStorage.getItem("petverse_selected_pet_id");
    if (petId) {
      api.get(`/pets/${petId}`)
        .then(r => setActivePet(r.data?.data || r.data))
        .catch(() => {});
    }
  }, []);

  // Compute AI Match Score for a product (species/breed compatibility)
  const getAIMatchScore = useCallback((product) => {
    if (!activePet) return 70;

    let score = 70;

    const petTypes = product.pet_types || product.petTypes || [];
    const speciesMatch = petTypes.some(
      t => t.toLowerCase() === (activePet.species || '').toLowerCase()
    );
    if (petTypes.length > 0 && !speciesMatch) return 0;
    if (speciesMatch) score += 15;

    return Math.max(0, Math.min(99, score));
  }, [activePet]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products
      .map(p => ({
        ...p,
        aiMatchScore: getAIMatchScore(p)
      }))
      .filter(p => {
        if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          const matchesText =
            (p.name || '').toLowerCase().includes(lower) ||
            (p.brand || '').toLowerCase().includes(lower) ||
            (p.description || '').toLowerCase().includes(lower);
          if (!matchesText) return false;
        }

        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }

        const finalPrice = p.discount_percent
          ? p.price * (1 - p.discount_percent / 100)
          : (p.price || 0);
        if (finalPrice > maxPrice) return false;

        if ((p.rating || 0) < minRating) return false;

        return true;
      });
  }, [products, searchTerm, selectedCategory, maxPrice, minRating, activePet, getAIMatchScore]);

  // AI Recommendations sorted highest score first
  const aiRecommendations = useMemo(() => {
    if (!activePet) return products.slice(0, 6);
    return products
      .map(p => ({
        ...p,
        aiMatchScore: getAIMatchScore(p)
      }))
      .filter(p => p.aiMatchScore >= 80)
      .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
      .slice(0, 10);
  }, [products, activePet, getAIMatchScore]);

  return {
    products,
    filteredProducts,
    aiRecommendations,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    getAIMatchScore
  };
}
