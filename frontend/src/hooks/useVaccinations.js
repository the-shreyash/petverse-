import { useMemo, useCallback } from "react";
import { useHealth } from "./useHealth";

/**
 * useVaccinations — Domain hook for the Vaccination Center.
 * Backed by the real /pets/{id}/health/vaccinations API via useHealth().
 * `vaccinations` are already normalized ({ name, status, dateAdministered, dateDue }).
 */
export function useVaccinations() {
  const {
    pets,
    selectedPetId,
    selectedPet,
    changeSelectedPet,
    vaccinations,
    addVaccination
  } = useHealth();

  const completed = useMemo(
    () => vaccinations.filter((v) => v.status === "Completed"),
    [vaccinations]
  );

  const overdue = useMemo(
    () => vaccinations.filter((v) => v.status === "Overdue"),
    [vaccinations]
  );

  const upcoming = useMemo(
    () => vaccinations.filter((v) => v.status === "Upcoming"),
    [vaccinations]
  );

  const complianceRate = useMemo(() => {
    if (vaccinations.length === 0) return 100;
    return Math.round((completed.length / vaccinations.length) * 100);
  }, [vaccinations, completed]);

  const nextDue = useMemo(() => {
    const sorted = [...upcoming, ...overdue]
      .filter((v) => v.dateDue)
      .sort((a, b) => new Date(a.dateDue) - new Date(b.dateDue));
    return sorted[0] || null;
  }, [upcoming, overdue]);

  // Adapts the VaccinationForm payload (legacy nested or flat) to the real API.
  const addRecord = useCallback(
    async (formPayload) => {
      const vax = formPayload.vaccinations?.[0] || formPayload;
      return addVaccination({
        vaccine_name: vax.name || vax.vaccine_name,
        dateAdministered: vax.dateAdministered || formPayload.visitDate,
        dateDue: vax.dateDue,
        status: vax.status
      });
    },
    [addVaccination]
  );

  return {
    pets,
    selectedPetId,
    selectedPet,
    changeSelectedPet,
    vaccinations,
    completed,
    overdue,
    upcoming,
    complianceRate,
    nextDue,
    totalCount: vaccinations.length,
    overdueCount: overdue.length,
    addRecord
  };
}
