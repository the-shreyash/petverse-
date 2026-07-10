import { useState, useEffect, useCallback } from "react";
import { getStoredPets, saveStoredPets } from "@/mock/pets";
import {
  getStoredHealthRecords,
  saveStoredHealthRecords,
  getStoredAppointments,
  saveStoredAppointments,
  getStoredEmergencyContacts,
  saveStoredEmergencyContacts
} from "@/mock/health";

export function useHealth() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  // Load initial datasets
  useEffect(() => {
    const loadedPets = getStoredPets();
    setPets(loadedPets);

    // Get active pet or default to first
    const savedActiveId = localStorage.getItem("petverse_selected_pet_id");
    if (savedActiveId && loadedPets.some(p => p.id === savedActiveId)) {
      setSelectedPetId(savedActiveId);
    } else if (loadedPets.length > 0) {
      setSelectedPetId(loadedPets[0].id);
      localStorage.setItem("petverse_selected_pet_id", loadedPets[0].id);
    }

    setRecords(getStoredHealthRecords());
    setAppointments(getStoredAppointments());
    setEmergencyContacts(getStoredEmergencyContacts());
  }, []);

  const changeSelectedPet = useCallback((id) => {
    setSelectedPetId(id);
    localStorage.setItem("petverse_selected_pet_id", id);
  }, []);

  const selectedPet = pets.find((p) => p.id === selectedPetId) || null;

  // Filter lists for active pet
  const petRecords = records.filter((r) => r.petId === selectedPetId);
  const petAppointments = appointments.filter((a) => a.petId === selectedPetId);

  // Helper to sync derived data back to the primary pet list
  const syncToPetProfile = useCallback((petId, updatedRecords, updatedApts) => {
    const allPets = getStoredPets();
    const targetPetIndex = allPets.findIndex((p) => p.id === petId);
    if (targetPetIndex === -1) return;

    const pet = allPets[targetPetIndex];
    const petSpecificRecords = updatedRecords.filter((r) => r.petId === petId);
    const petSpecificApts = updatedApts.filter((a) => a.petId === petId);

    // 1. Calculate latest weight
    let latestWeight = pet.weight;
    const sortedByDate = [...petSpecificRecords].sort(
      (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
    );
    const recordWithWeight = sortedByDate.find((r) => r.weight > 0);
    if (recordWithWeight) {
      latestWeight = `${recordWithWeight.weight} kg`;
    }

    // 2. Build weight history
    const weightHistory = petSpecificRecords
      .filter((r) => r.weight > 0)
      .map((r) => ({ date: r.visitDate, weight: r.weight }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // 3. Compile medical history timeline
    const medicalHistory = petSpecificRecords.map((r) => ({
      id: r.id,
      date: r.visitDate,
      type: r.diagnosis.toLowerCase().includes("surgery") ? "Surgery" : "Checkup",
      notes: r.treatment || r.notes,
      diagnosis: r.diagnosis,
      vet: r.veterinarian
    }));

    // 4. Compile vaccinations
    const vaccinations = [];
    petSpecificRecords.forEach((r) => {
      if (r.vaccinations && r.vaccinations.length > 0) {
        r.vaccinations.forEach((v, index) => {
          vaccinations.push({
            id: `${r.id}-vax-${index}`,
            name: v.name,
            dateAdministered: v.dateAdministered,
            dateDue: v.dateDue,
            status: v.status,
            notes: v.notes
          });
        });
      }
    });

    // 5. Compile documents
    const documents = [];
    petSpecificRecords.forEach((r) => {
      if (r.attachments && r.attachments.length > 0) {
        r.attachments.forEach((a) => {
          documents.push({
            id: a.id,
            name: a.name,
            uploadDate: a.uploadDate,
            type: a.category,
            fileUrl: a.url
          });
        });
      }
    });

    // 6. Compile appointments
    const pApts = petSpecificApts.map((a) => ({
      id: a.id,
      date: a.visitDate,
      time: a.time,
      reason: a.reason,
      status: a.status,
      doctor: a.veterinarian
    }));

    // 7. Health score
    let latestScore = pet.healthScore || 90;
    if (sortedByDate.length > 0 && sortedByDate[0].healthScore > 0) {
      latestScore = sortedByDate[0].healthScore;
    }

    // Apply updates
    allPets[targetPetIndex] = {
      ...pet,
      weight: latestWeight,
      weightHistory: weightHistory.length > 0 ? weightHistory : pet.weightHistory,
      medicalHistory: medicalHistory.length > 0 ? medicalHistory : pet.medicalHistory,
      vaccinations: vaccinations.length > 0 ? vaccinations : pet.vaccinations,
      documents: documents.length > 0 ? documents : pet.documents,
      appointments: pApts.length > 0 ? pApts : pet.appointments,
      healthScore: latestScore,
      health: latestScore > 85 ? "Healthy" : latestScore > 60 ? "Vaccination Due" : "Needs Checkup"
    };

    saveStoredPets(allPets);
    setPets(allPets);
  }, []);

  // CRUD for Health Records
  const addRecord = useCallback((recordData) => {
    const newRecord = {
      ...recordData,
      id: `rec-${Date.now()}`,
      petId: selectedPetId
    };

    setRecords((prev) => {
      const updated = [newRecord, ...prev];
      saveStoredHealthRecords(updated);
      syncToPetProfile(selectedPetId, updated, appointments);
      return updated;
    });
  }, [selectedPetId, appointments, syncToPetProfile]);

  const updateRecord = useCallback((id, updatedFields) => {
    setRecords((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, ...updatedFields } : r));
      saveStoredHealthRecords(updated);
      syncToPetProfile(selectedPetId, updated, appointments);
      return updated;
    });
  }, [selectedPetId, appointments, syncToPetProfile]);

  const deleteRecord = useCallback((id) => {
    setRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      saveStoredHealthRecords(updated);
      syncToPetProfile(selectedPetId, updated, appointments);
      return updated;
    });
  }, [selectedPetId, appointments, syncToPetProfile]);

  // CRUD for Appointments
  const addAppointment = useCallback((aptData) => {
    const newApt = {
      ...aptData,
      id: `apt-${Date.now()}`,
      petId: selectedPetId,
      status: "Upcoming"
    };

    setAppointments((prev) => {
      const updated = [newApt, ...prev];
      saveStoredAppointments(updated);
      syncToPetProfile(selectedPetId, records, updated);
      return updated;
    });
  }, [selectedPetId, records, syncToPetProfile]);

  const updateAppointment = useCallback((id, updatedFields) => {
    setAppointments((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
      saveStoredAppointments(updated);
      syncToPetProfile(selectedPetId, records, updated);
      return updated;
    });
  }, [selectedPetId, records, syncToPetProfile]);

  const deleteAppointment = useCallback((id) => {
    setAppointments((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      saveStoredAppointments(updated);
      syncToPetProfile(selectedPetId, records, updated);
      return updated;
    });
  }, [selectedPetId, records, syncToPetProfile]);

  // Emergency Contact management
  const addEmergencyContact = useCallback((contactData) => {
    const newContact = {
      ...contactData,
      id: `contact-${Date.now()}`
    };
    setEmergencyContacts((prev) => {
      const updated = [...prev, newContact];
      saveStoredEmergencyContacts(updated);
      return updated;
    });
  }, []);

  const deleteEmergencyContact = useCallback((id) => {
    setEmergencyContacts((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveStoredEmergencyContacts(updated);
      return updated;
    });
  }, []);

  return {
    pets,
    selectedPetId,
    selectedPet,
    changeSelectedPet,
    records: petRecords,
    allRecords: records,
    appointments: petAppointments,
    allAppointments: appointments,
    emergencyContacts,
    addRecord,
    updateRecord,
    deleteRecord,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addEmergencyContact,
    deleteEmergencyContact
  };
}
