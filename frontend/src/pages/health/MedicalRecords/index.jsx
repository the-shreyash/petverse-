import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { useHealth } from "@/hooks/useHealth";
import { Plus, Search, RefreshCw, Stethoscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Cards, Badges, and Forms
import MedicalRecordCard from "@/components/health/cards/MedicalRecordCard";
import MedicalRecordForm from "@/components/health/forms/MedicalRecordForm";
import DocumentPreview from "@/components/health/shared/DocumentPreview";

export default function MedicalRecordsView() {
  const {
    pets,
    selectedPet,
    changeSelectedPet,
    records,
    addRecord,
    deleteRecord
  } = useHealth();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  if (!selectedPet) {
    return (
      <DashboardLayout pageTitle="Medical Records" pageDescription="Log clinical assessments.">
        <div className="flex h-64 items-center justify-center">
          <p className="font-bold text-slate-400">Loading profile data...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Filter based on search criteria
  const filteredRecords = records.filter(
    (rec) =>
      rec.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.veterinarian.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.clinic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout
      pageTitle={`${selectedPet.name} - Medical Records`}
      pageDescription="Complete repository of checkup records, treatments, and diagnostics."
    >
      <div className="space-y-8">
        {/* Sub-Header & Actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Pet Toggle */}
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

          {/* Add Record Trigger */}
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
            <span>Add Clinical Log</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="relative w-full max-w-lg">
          <Search className="absolute top-3.5 left-4 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search diagnostics by vet, diagnosis, or clinic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white"
          />
        </div>

        {/* Grid list of Medical Records */}
        <AnimatePresence mode="popLayout">
          {filteredRecords.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-1">
              {filteredRecords.map((rec) => (
                <motion.div
                  key={rec.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <MedicalRecordCard
                    record={rec}
                    onDelete={deleteRecord}
                    onSelectDocument={(file) => setActiveDoc(file)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center bg-white/50">
              <Stethoscope size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-400 font-bold text-lg">No medical records match your criteria.</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:underline"
                >
                  <RefreshCw size={12} />
                  <span>Reset Search</span>
                </button>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Form Modal overlay */}
        <MedicalRecordForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={addRecord}
        />

        {/* Attachment preview overlay */}
        <DocumentPreview
          isOpen={!!activeDoc}
          onClose={() => setActiveDoc(null)}
          document={activeDoc}
        />
      </div>
    </DashboardLayout>
  );
}
