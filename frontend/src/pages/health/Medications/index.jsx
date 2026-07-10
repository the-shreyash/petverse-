import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { useHealth } from "@/hooks/useHealth";
import { Plus, Pill, RefreshCw, BarChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import MedicationCard from "@/components/health/cards/MedicationCard";
import MedicationForm from "@/components/health/forms/MedicationForm";

export default function MedicationsView() {
  const {
    pets,
    selectedPet,
    changeSelectedPet,
    records,
    addRecord
  } = useHealth();

  const [activeTab, setActiveTab] = useState("active");
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!selectedPet) {
    return (
      <DashboardLayout pageTitle="Medications Schedule" pageDescription="Track pill courses.">
        <div className="flex h-64 items-center justify-center">
          <p className="font-bold text-slate-400">Loading prescription logs...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Compile all medications from records
  const medications = [];
  records.forEach((r) => {
    if (r.medications && r.medications.length > 0) {
      r.medications.forEach((m, idx) => {
        medications.push({
          ...m,
          id: `${r.id}-med-${idx}`
        });
      });
    }
  });

  const activeMedications = medications.filter((m) => !m.completed);
  const completedMedications = medications.filter((m) => m.completed);

  const getFilteredMedications = () => {
    if (activeTab === "completed") return completedMedications;
    return activeMedications;
  };

  const displayedMeds = getFilteredMedications();

  // Compliance stat
  const totalCourses = medications.length;
  const activeCount = activeMedications.length;
  const complianceRate = totalCourses > 0 ? Math.round(((totalCourses - activeCount) / totalCourses) * 100) : 100;

  return (
    <DashboardLayout
      pageTitle={`${selectedPet.name} - Medication Scheduler`}
      pageDescription="Log daily doses and keep tracks of pill durations, compliance, and adherence rates."
    >
      <div className="space-y-8">
        {/* Toggle & Actions Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {pets.map((p) => (
              <button
                key={p.id}
                onClick={() => changeSelectedPet(p.id)}
                className={`
                  rounded-full
                  border
                  px-4
                  py-2
                  text-sm
                  font-black
                  transition-all
                  ${
                    p.id === selectedPet.id
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }
                `}
              >
                {p.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-gradient-to-r
              from-emerald-500
              to-cyan-500
              px-6
              py-3.5
              font-bold
              text-white
              shadow-lg
              shadow-emerald-500/20
              transition-all
              hover:-translate-y-0.5
              hover:shadow-xl
              hover:shadow-emerald-500/30
            "
          >
            <Plus size={18} />
            <span>Prescribe Medication</span>
          </button>
        </div>

        {/* Adherence Overview */}
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <BarChart size={18} className="text-indigo-500" />
              <span>Adherence Performance</span>
            </h4>
            <p className="text-sm font-semibold text-slate-500">
              A high adherence level is essential for treatments to work correctly.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-2xl font-black text-slate-800">{complianceRate}%</span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider mt-0.5">Overall Completion</span>
            </div>
            <div className="h-10 border-l border-slate-200" />
            <div>
              <span className="text-2xl font-black text-slate-800">{activeCount}</span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider mt-0.5">Active Regimens</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("active")}
            className={`border-b-2 px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === "active" ? "border-emerald-500 text-emerald-600 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Active Treatment ({activeMedications.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`border-b-2 px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === "completed" ? "border-emerald-500 text-emerald-600 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Completed Courses ({completedMedications.length})
          </button>
        </div>

        {/* Grid List */}
        <div className="mt-6">
          <AnimatePresence mode="popLayout">
            {displayedMeds.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayedMeds.map((med) => (
                  <motion.div
                    key={med.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MedicationCard medication={med} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center bg-white/50">
                <Pill className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="text-slate-400 font-bold text-lg">No medications found in this category.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Prescription Modal */}
        <MedicationForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={addRecord}
        />
      </div>
    </DashboardLayout>
  );
}
