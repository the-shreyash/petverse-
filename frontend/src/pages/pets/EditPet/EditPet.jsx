import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Sparkles, Activity, ShieldCheck, Coffee, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import DashboardHeader from "@/pages/dashboard/DashboardHome/DashboardHeader";
import { getStoredPets, saveStoredPets } from "@/mock/pets";
import { usePetForm } from "@/hooks/usePetForm";

// Form components imports
import BasicInformationForm from "@/components/pets/forms/BasicInformationForm";
import PhotoUploader from "@/components/pets/forms/PhotoUploader";
import HealthInformationForm from "@/components/pets/forms/HealthInformationForm";
import FeedingInformationForm from "@/components/pets/forms/FeedingInformationForm";

export default function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState("basic");
  const { formData, errors, updateFields, validateStep, setFormData } = usePetForm();

  useEffect(() => {
    const list = getStoredPets();
    const found = list.find((p) => p.id === id);
    if (!found) {
      navigate("/pets");
    } else {
      setFormData(found);
    }
  }, [id, navigate, setFormData]);

  const handleSave = () => {
    // Validate forms depending on sub-tab or run all validations
    let isValid = true;
    if (activeSubTab === "basic") {
      isValid = validateStep(1);
    } else if (activeSubTab === "photo") {
      isValid = validateStep(2);
    } else if (activeSubTab === "feeding") {
      isValid = validateStep(4);
    }

    if (!isValid) return;

    const list = getStoredPets();
    // Update weight history if weight changed
    let weightHistory = formData.weightHistory || [];
    const lastWeightEntry = weightHistory[weightHistory.length - 1];
    if (!lastWeightEntry || parseFloat(lastWeightEntry.weight) !== parseFloat(formData.weight)) {
      weightHistory = [
        ...weightHistory,
        { date: new Date().toISOString().split("T")[0], weight: parseFloat(formData.weight) }
      ];
    }

    const updatedList = list.map((p) => {
      if (p.id === id) {
        return {
          ...formData,
          weightHistory
        };
      }
      return p;
    });

    saveStoredPets(updatedList);
    navigate(`/pets/${id}`);
  };

  if (!formData.name) {
    return (
      <DashboardLayout pageTitle="Loading Profile Edit...">
        <div className="flex h-64 items-center justify-center">
          <p className="text-slate-500 font-bold">Loading Pet Form...</p>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: "basic", name: "Basic Info", icon: Activity },
    { id: "health", name: "Health Logs", icon: ShieldCheck },
    { id: "feeding", name: "Nutrition Specs", icon: Coffee },
    { id: "photo", name: "Profile Image", icon: ImageIcon }
  ];

  return (
    <DashboardLayout
      pageTitle={`Edit ${formData.name}`}
      pageDescription="Modify pet profile settings."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header navigation bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/pets/${id}`)}
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                border
                border-slate-200
                bg-white
                text-slate-600
                transition-all
                hover:bg-slate-50
                hover:text-slate-900
                shadow-sm
              "
            >
              <ChevronLeft size={20} />
            </button>
            <DashboardHeader
              title={`Edit ${formData.name}`}
              subtitle="Keep your pet's configuration profile up to date."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/pets/${id}`)}
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-5
                py-3
                font-bold
                text-slate-600
                transition-all
                hover:bg-slate-50
              "
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                bg-slate-900
                px-6
                py-3
                font-bold
                text-white
                transition-all
                hover:bg-slate-800
                shadow-sm
              "
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`
                  flex
                  items-center
                  gap-2
                  border-b-2
                  px-5
                  py-3
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

        {/* Form Container Card */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/95 p-6 sm:p-8 shadow-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeSubTab === "basic" && (
                <BasicInformationForm formData={formData} errors={errors} updateFields={updateFields} />
              )}
              {activeSubTab === "health" && (
                <HealthInformationForm formData={formData} updateFields={updateFields} />
              )}
              {activeSubTab === "feeding" && (
                <FeedingInformationForm formData={formData} errors={errors} updateFields={updateFields} />
              )}
              {activeSubTab === "photo" && (
                <PhotoUploader formData={formData} errors={errors} updateFields={updateFields} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
