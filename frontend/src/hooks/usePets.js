import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";

export function usePets() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPets = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // GET /pets returns { data: [...], total, page, per_page }
      const response = await api.get("/pets");
      const loadedPets = response.data?.data || response.data?.pets || [];
      setPets(loadedPets);

      const savedActiveId = localStorage.getItem("petverse_selected_pet_id");
      if (savedActiveId && loadedPets.some(p => p.id === savedActiveId)) {
        setSelectedPetId(savedActiveId);
      } else if (loadedPets.length > 0) {
        setSelectedPetId(loadedPets[0].id);
        localStorage.setItem("petverse_selected_pet_id", loadedPets[0].id);
      }
    } catch (err) {
      console.error("Failed to load pets", err);
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const changeSelectedPet = useCallback((id) => {
    setSelectedPetId(id);
    localStorage.setItem("petverse_selected_pet_id", id);
  }, []);

  const selectedPet = pets.find((p) => p.id === selectedPetId) || null;

  return {
    pets,
    selectedPetId,
    selectedPet,
    changeSelectedPet,
    loading,
    refreshPets: fetchPets
  };
}
