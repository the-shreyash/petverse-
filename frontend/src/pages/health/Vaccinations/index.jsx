import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { useHealth } from "@/hooks/useHealth";
import { Plus, Shield, ShieldCheck, Activity, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import VaccinationCard from "@/components/health/cards/VaccinationCard";
import VaccinationForm from "@/components/health/forms/VaccinationForm";
import VaccinationTimeline from "@/components/health/timeline/VaccinationTimeline";

export default function VaccinationsView() {
  const {
    pets,
    selectedPet,
    changeSelectedPet,
    records,
    addRecord
  } = useHealth();

  const [activeTab, setActiveTab] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!selectedPet) {
    return (
      <DashboardLayout pageTitle="Vaccination Log" pageDescription="Immunization tracker.">
        <div className="flex h-64 items-center justify-center">
          <p className="font-bold text-slate-400">Loading central registries...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Compile all vaccinations from health records
  const vaccinations = [];
  records.forEach((r) => {
    if (r.vaccinations && r.vaccinations.length > 0) {
      r.vaccinations.forEach((v, idx) => {
        vaccinations.push({
          ...v,
          id: `${r.id}-vax-${idx}`
        });
      });
    }
  });

  const completedVax = vaccinations.filter((v) => v.status === "Completed");
  const pendingVax = vaccinations.filter((v) => v.status === "Upcoming" || v.status === "Vaccination Due" || v.status === "Overdue");

  const tabs = [
    { id: "all", name: "All Schedules", icon: Shield },
    { id: "completed", name: "Completed", icon: ShieldCheck },
    { id: "upcoming", name: "Boosters Due", icon: Activity },
    { id: "timeline", name: "Immunization Feed", icon: Award }
  ];

  const getFilteredVaccines = () => {
    if (activeTab === "completed") return completedVax;
    if (activeTab === "upcoming") return pendingVax;
    return vaccinations;
  };

  const displayedVax = getFilteredVaccines();

  return (
    <DashboardLayout
      pageTitle={`${selectedPet.name} - Vaccinations`}
      pageDescription="Monitor upcoming booster calendars and review verified immunization files."
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
            <span>Add Vaccination</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex
                  items-center
                  gap-2
                  border-b-2
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  transition-all
                  shrink-0
                  ${
                    isActive
                      ? "border-emerald-500 text-emerald-600 font-extrabold"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }
                `}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* List Content */}
        <div className="mt-6">
          {activeTab === "timeline" ? (
            <VaccinationTimeline vaccinations={vaccinations} />
          ) : (
            <AnimatePresence mode="popLayout">
              {displayedVax.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayedVax.map((vax) => (
                    <motion.div
                      key={vax.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <VaccinationCard vaccination={vax} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center bg-white/50">
                  <Shield className="mx-auto text-slate-300 mb-3" size={40} />
                  <p className="text-slate-400 font-bold text-lg">No vaccinations found for this category.</p>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Modal Form */}
        <VaccinationForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={addRecord}
        />
      </div>
    </DashboardLayout>
  );
}
