import { useState } from "react";

const initialFormState = {
  name: "",
  species: "Dog",
  breed: "",
  gender: "Female",
  birthDate: "",
  weight: "",
  color: "",
  microchip: "",
  profileImage: "",
  gallery: [],
  healthScore: 90, // Default base health score
  vaccinations: [],
  medicalHistory: [],
  feedingPreferences: {
    foodType: "",
    frequency: "2 times daily",
    portionSize: "",
    allergies: "None",
    notes: ""
  },
  documents: [],
  appointments: []
};

export function usePetForm(initialData = null) {
  const [formData, setFormData] = useState(initialData || initialFormState);
  const [errors, setErrors] = useState({});

  const updateFields = (fields) => {
    setFormData((prev) => {
      // Handle nested feeding preferences updates
      if (fields.feedingPreferences) {
        return {
          ...prev,
          ...fields,
          feedingPreferences: {
            ...prev.feedingPreferences,
            ...fields.feedingPreferences
          }
        };
      }
      return { ...prev, ...fields };
    });
    // Clear errors for fields being updated
    if (Object.keys(fields).length > 0) {
      setErrors((prev) => {
        const next = { ...prev };
        Object.keys(fields).forEach((key) => {
          delete next[key];
        });
        return next;
      });
    }
  };

  const validateStep = (step) => {
    const stepErrors = {};

    if (step === 1) {
      if (!formData.name?.trim()) stepErrors.name = "Pet name is required";
      if (!formData.species?.trim()) stepErrors.species = "Species is required";
      if (!formData.breed?.trim()) stepErrors.breed = "Breed is required";
      if (!formData.gender) stepErrors.gender = "Gender is required";
      if (!formData.birthDate) stepErrors.birthDate = "Birth date is required";
      if (!formData.weight || isNaN(formData.weight) || parseFloat(formData.weight) <= 0) {
        stepErrors.weight = "Weight must be a valid positive number";
      }
    }

    if (step === 2) {
      if (!formData.profileImage) {
        stepErrors.profileImage = "Profile photo is required";
      }
    }

    if (step === 4) {
      const feeding = formData.feedingPreferences;
      if (!feeding.foodType?.trim()) {
        stepErrors.foodType = "Food type is required";
      }
      if (!feeding.portionSize?.trim()) {
        stepErrors.portionSize = "Portion size is required";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  return {
    formData,
    errors,
    updateFields,
    validateStep,
    resetForm,
    setFormData
  };
}
