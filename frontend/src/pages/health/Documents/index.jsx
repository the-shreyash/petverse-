import React, { useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { useHealth } from "@/hooks/useHealth";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  Plus,
  Search,
  Grid3X3,
  List,
  FileText,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  FileSignature,
  Receipt,
  X,
  Upload,
  Filter
} from "lucide-react";

import HealthHeader from "@/components/health/shared/HealthHeader";
import StatisticCard from "@/components/health/shared/StatisticCard";
import MedicalDocumentCard from "@/components/health/cards/MedicalDocumentCard";
import DocumentPreview from "@/components/health/shared/DocumentPreview";
import AISummaryPlaceholder from "@/components/health/shared/AISummaryPlaceholder";

const CATEGORIES = [
  { id: "all", label: "All Documents", icon: FolderOpen },
  { id: "Certificate", label: "Certificates", icon: ShieldCheck },
  { id: "Lab Result", label: "Lab Results", icon: FlaskConical },
  { id: "Prescription", label: "Prescriptions", icon: FileSignature },
  { id: "Medical Report", label: "Reports", icon: Stethoscope },
  { id: "Discharge Summary", label: "Discharge", icon: FileText },
  { id: "Invoice", label: "Invoices", icon: Receipt }
];

export default function DocumentsView() {
  const { pets, selectedPet, selectedPetId, changeSelectedPet } = useHealth();

  const [allDocs, setAllDocs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [activeDoc, setActiveDoc] = useState(null);
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);

  const petDocs = useMemo(
    () => allDocs.filter((d) => d.petId === selectedPetId),
    [allDocs, selectedPetId]
  );

  const filteredDocs = useMemo(() => {
    let result = petDocs;
    if (activeCategory !== "all") {
      result = result.filter((d) => d.category === activeCategory);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (d) =>
          d.name?.toLowerCase().includes(lower) ||
          d.category?.toLowerCase().includes(lower) ||
          d.doctor?.toLowerCase().includes(lower) ||
          d.description?.toLowerCase().includes(lower)
      );
    }
    return result.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  }, [petDocs, activeCategory, searchTerm]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    petDocs.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, [petDocs]);

  const handleSimulatedUpload = () => {
    setShowUploadPrompt(false);
    const categories = ["Prescription", "Lab Result", "Medical Report", "Certificate"];
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const newDoc = {
      id: `doc-upload-${Date.now()}`,
      petId: selectedPetId,
      name: `${selectedPet?.name}_Document_${Date.now()}.pdf`,
      category: cat,
      uploadDate: new Date().toISOString().split("T")[0],
      doctor: "Dr. Sarah Wilson",
      clinic: "Oakwood Veterinary Hospital",
      fileSize: "128 KB",
      url: "#",
      description: "Newly uploaded medical document."
    };
    const updated = [newDoc, ...allDocs];
    setAllDocs(updated);
  };

  if (!selectedPet) {
    return (
      <DashboardLayout pageTitle="Medical Documents" pageDescription="Secure document vault.">
        <div className="flex h-64 items-center justify-center rounded-[30px] border border-dashed border-slate-200 bg-white">
          <p className="font-bold text-slate-400">Loading document vault...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      pageTitle={`${selectedPet.name} — Medical Documents`}
      pageDescription="Secure vault for prescriptions, lab reports, vaccination certificates, and discharge summaries."
    >
      <div className="space-y-8">
        {/* Header */}
        <HealthHeader
          pets={pets}
          selectedPetId={selectedPetId}
          onChangePet={changeSelectedPet}
          accentColor="indigo"
          actionLabel="Upload Document"
          onAction={() => setShowUploadPrompt(true)}
          actionIcon={Upload}
        />

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatisticCard
            label="Total Files"
            value={petDocs.length}
            icon={FolderOpen}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-50"
          />
          <StatisticCard
            label="Certificates"
            value={categoryCounts["Certificate"] || 0}
            icon={ShieldCheck}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <StatisticCard
            label="Lab Results"
            value={categoryCounts["Lab Result"] || 0}
            icon={FlaskConical}
            iconColor="text-violet-600"
            iconBg="bg-violet-50"
          />
          <StatisticCard
            label="Prescriptions"
            value={categoryCounts["Prescription"] || 0}
            icon={FileSignature}
            iconColor="text-cyan-600"
            iconBg="bg-cyan-50"
          />
        </div>

        {/* AI Placeholder */}
        <AISummaryPlaceholder
          title="AI Document Intelligence"
          description={`Automatically extract key insights from ${selectedPet.name}'s medical files — diagnoses, medications, follow-up dates, and risk flags.`}
          variant="compact"
          feature="health-summary"
        />

        {/* Toolbar: Search + View Toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search documents by name, doctor, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-xl border p-2.5 transition ${
                viewMode === "grid"
                  ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                  : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-xl border p-2.5 transition ${
                viewMode === "list"
                  ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                  : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = cat.id === "all" ? petDocs.length : (categoryCounts[cat.id] || 0);
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -1 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all
                  ${isActive
                    ? "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }
                `}
              >
                <Icon size={13} />
                <span>{cat.label}</span>
                <span className={`rounded-full px-1.5 text-[9px] font-black ${isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-400"}`}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Document Grid / List */}
        <AnimatePresence mode="popLayout">
          {filteredDocs.length > 0 ? (
            <motion.div
              key="docs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === "grid"
                  ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "space-y-3"
              }
            >
              {filteredDocs.map((doc, idx) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                >
                  <MedicalDocumentCard
                    document={doc}
                    onPreview={setActiveDoc}
                    variant={viewMode === "list" ? "list" : "grid"}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-[30px] border border-dashed border-slate-200 bg-white py-20 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
                <FolderOpen className="text-slate-300" size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-700">No documents found</h3>
              <p className="mt-1 max-w-xs text-sm font-semibold text-slate-400">
                {searchTerm
                  ? "No documents match your search. Try different keywords."
                  : `No ${activeCategory === "all" ? "" : activeCategory + " "}documents uploaded for ${selectedPet.name} yet.`
                }
              </p>
              {(searchTerm || activeCategory !== "all") && (
                <button
                  onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                >
                  <Filter size={13} />
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload prompt modal */}
        <AnimatePresence>
          {showUploadPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
              onClick={() => setShowUploadPrompt(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-[30px] bg-white p-8 shadow-2xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Upload size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-800">Upload Medical Document</h3>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Drag & drop or choose a file to attach to {selectedPet.name}'s medical vault.
                </p>
                <div className="mt-6 flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer">
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 text-slate-300" size={24} />
                    <p className="text-xs font-bold text-slate-400">PDF, JPG, PNG up to 10MB</p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowUploadPrompt(false)}
                    className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSimulatedUpload}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:shadow-indigo-500/30"
                  >
                    Simulate Upload
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Document preview overlay */}
        <DocumentPreview
          isOpen={!!activeDoc}
          onClose={() => setActiveDoc(null)}
          document={activeDoc}
        />
      </div>
    </DashboardLayout>
  );
}
