import { useState, useEffect, useCallback, useMemo } from "react";
import { usePets } from "./usePets";
import api from "@/services/api";

const combineDateTime = (date, time) => {
  if (!date) return undefined;
  // If already a full ISO string, pass through.
  if (typeof date === "string" && date.includes("T")) return date;
  if (time && /^\d{1,2}:\d{2}$/.test(time)) {
    const [h, m] = time.split(":");
    return `${date}T${h.padStart(2, "0")}:${m}:00`;
  }
  return `${date}T09:00:00`;
};

const mapVaccination = (v) => {
  const due = v.next_due_date || v.next_due || null;
  const administered = v.administration_date || v.date_administered || null;
  const raw = (v.status || "").toLowerCase();
  const startOfToday = new Date(new Date().toDateString());
  let status = "Completed";
  if (due && new Date(due) < startOfToday) {
    status = "Overdue";
  } else if (raw && !["administered", "completed", "done"].includes(raw)) {
    status = "Upcoming";
  }
  return {
    id: v.id,
    name: v.vaccine_name || v.name || "Vaccine",
    vaccine_name: v.vaccine_name || v.name || "Vaccine",
    status,
    dateAdministered: administered,
    dateDue: due,
    next_due_date: due,
    manufacturer: v.manufacturer || null,
    notes: v.notes || ""
  };
};

const mapAppointment = (a) => {
  const visit = a.visit_date || a.visitDate || null;
  let time = "";
  if (visit) {
    const d = new Date(visit);
    if (!isNaN(d.getTime())) {
      time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }
  }
  return {
    id: a.id,
    visitDate: visit,
    time,
    reason: a.reason || "Vet visit",
    notes: a.notes || "",
    veterinarian: a.veterinarian || "",
    clinic: a.clinic_name || a.clinic?.name || "",
    status: a.status || "Scheduled"
  };
};

export function useHealth() {
  const { pets, selectedPetId, selectedPet, changeSelectedPet } = usePets();
  const [records, setRecords] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [appointments, setAppointments] = useState([]); // Needed for dashboard
  const [healthScore, setHealthScore] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHealthData = useCallback(async () => {
    if (!selectedPetId) {
      setRecords([]);
      setVaccinations([]);
      setAppointments([]);
      setHealthScore(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const unwrap = (res) => res.data?.data ?? res.data ?? [];

      const [recordsRes, vaxRes, apptRes, scoreRes] = await Promise.all([
        api.get(`/pets/${selectedPetId}/health/medical-records`),
        api.get(`/pets/${selectedPetId}/health/vaccinations`),
        api.get(`/pets/${selectedPetId}/health/appointments`),
        api.get(`/pets/${selectedPetId}/health/score`).catch(() => null),
      ]);

      setRecords(unwrap(recordsRes));
      setVaccinations((unwrap(vaxRes) || []).map(mapVaccination));
      setAppointments((unwrap(apptRes) || []).map(mapAppointment));
      setHealthScore(scoreRes ? (scoreRes.data?.data ?? scoreRes.data ?? null) : null);
    } catch (err) {
      console.error("Failed to fetch health data", err);
    } finally {
      setLoading(false);
    }
  }, [selectedPetId]);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  const addRecord = useCallback(async (recordData) => {
    try {
      const response = await api.post(`/pets/${selectedPetId}/health/medical-records`, {
        record_type: recordData.record_type || "Checkup",
        notes: recordData.notes || "",
        diagnosis: recordData.diagnosis || "",
        treatment: recordData.treatment || ""
      });
      if (response.status === 201 || response.status === 200) {
        fetchHealthData();
      }
    } catch (err) {
      console.error("Failed to add health record", err);
    }
  }, [selectedPetId, fetchHealthData]);

  const addVaccination = useCallback(async (vaxData) => {
    try {
      const payload = {
        vaccine_name: vaxData.vaccine_name || vaxData.name,
        administration_date:
          vaxData.administration_date || vaxData.dateAdministered || vaxData.date_administered ||
          new Date().toISOString().split("T")[0],
        next_due_date: vaxData.next_due_date || vaxData.dateDue || vaxData.next_due || null,
        status: vaxData.status || "administered"
      };
      if (vaxData.manufacturer) payload.manufacturer = vaxData.manufacturer;
      const response = await api.post(`/pets/${selectedPetId}/health/vaccinations`, payload);
      if (response.status === 201 || response.status === 200) {
        fetchHealthData();
      }
    } catch (err) {
      console.error("Failed to add vaccination", err);
      throw err;
    }
  }, [selectedPetId, fetchHealthData]);

  const addAppointment = useCallback(async (apptData) => {
    try {
      const response = await api.post(`/pets/${selectedPetId}/health/appointments`, {
        visit_date: apptData.visit_date || combineDateTime(apptData.visitDate, apptData.time),
        reason: apptData.reason,
        notes: apptData.notes,
        clinic_name: apptData.clinic_name || apptData.clinic || apptData.clinicName || null,
        veterinarian: apptData.veterinarian
      });
      if (response.status === 201 || response.status === 200) {
        fetchHealthData();
      }
    } catch (err) {
      console.error("Failed to add appointment", err);
      throw err;
    }
  }, [selectedPetId, fetchHealthData]);

  const updateAppointment = useCallback(async (id, updates) => {
    try {
      // Normalize any camelCase date/time into a single ISO visit_date.
      const payload = { ...updates };
      if (payload.visitDate || payload.time) {
        payload.visit_date = combineDateTime(payload.visitDate, payload.time);
        delete payload.visitDate;
        delete payload.time;
      }

      const response = await api.put(`/pets/${selectedPetId}/health/appointments/${id}`, payload);
      if (response.status === 200) {
        fetchHealthData();
      }
    } catch (err) {
      console.error("Failed to update appointment", err);
      throw err;
    }
  }, [selectedPetId, fetchHealthData]);

  const searchClinics = useCallback(async (lat, lng, q = "vet clinic") => {
    if (!selectedPetId) return [];
    const res = await api.get(`/pets/${selectedPetId}/health/clinics/search`, {
      params: { lat, lng, q, provider: "google" }
    });
    return res.data?.data ?? res.data ?? [];
  }, [selectedPetId]);

  const deleteAppointment = useCallback(async (id) => {
    try {
      const response = await api.delete(`/pets/${selectedPetId}/health/appointments/${id}`);
      if (response.status === 204 || response.status === 200) {
        fetchHealthData();
      }
    } catch (err) {
      console.error("Failed to delete appointment", err);
    }
  }, [selectedPetId, fetchHealthData]);

  // Derived metrics
  const latestWeight = selectedPet?.weight || "0";
  const weightHistory = useMemo(() => {
    return records
      .filter(r => r.record_type === "Weight" && r.notes)
      .map(r => ({ date: r.visitDate, weight: parseFloat(r.notes) }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [records]);

  const medicalHistory = useMemo(() => {
    return records.map(r => ({
      id: r.id,
      date: r.visitDate,
      type: r.recordType,
      notes: r.notes,
      vet: r.veterinarian || "Dr. Default",
      clinic: r.clinic || "Local Clinic"
    }));
  }, [records]);

  return {
    pets,
    selectedPetId,
    selectedPet,
    changeSelectedPet,
    records: medicalHistory,
    appointments,
    vaccinations,
    healthScore,
    weightHistory,
    latestWeight,
    addRecord,
    addVaccination,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    searchClinics,
    loading
  };
}
