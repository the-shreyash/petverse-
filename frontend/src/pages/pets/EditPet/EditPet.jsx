import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Activity, ShieldCheck, Coffee, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import DashboardHeader from "@/pages/dashboard/DashboardHome/DashboardHeader";
import { usePetForm } from "@/hooks/usePetForm";
import api from "@/services/api";

import BasicInformationForm from "@/components/pets/forms/BasicInformationForm";
import PhotoUploader from "@/components/pets/forms/PhotoUploader";
import HealthInformationForm from "@/components/pets/forms/HealthInformationForm";
import FeedingInformationForm from "@/components/pets/forms/FeedingInformationForm";

export default function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState("basic");
  const { formData, errors, updateFields, validateStep, setFormData } = usePetForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }

      try {
        setLoading(true);
        const response = await api.get(`/pets/${id}`);
        const petData = response.data?.data || response.data;

        // Map backend fields → usePetForm field names
        setFormData({
          name: petData.name || "",
          species: petData.species || "",
          breed: petData.breed || "",
          gender: petData.gender || "",
          birthDate: petData.birth_date || "",
          weight: petData.weight || "",
          height: petData.height || "",
          color: petData.color || "",
          microchipNumber: petData.microchip_number || "",
          sterilized: petData.sterilized || false,
          bloodGroup: petData.blood_group || "",
          description: petData.description || "",
          profileImage: petData.profile_image || "",
          feedingPreferences: petData.feeding_preferences || {}
        });
      } catch (err) {
        console.error("Error fetching pet", err);
        navigate("/pets");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id, navigate, setFormData]);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Map usePetForm field names → backend field names
      const payload = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed || null,
        gender: formData.gender || null,
        birth_date: formData.birthDate || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        color: formData.color || null,
        microchip_number: formData.microchipNumber || null,
        sterilized: formData.sterilized || false,
        blood_group: formData.bloodGroup || null,
        description: formData.description || null
      };

      await api.put(`/pets/${id}`, payload);
      navigate(`/pets/${id}`);
    } catch (err) {
      console.error("Error updating pet", err);
      const detail = err?.response?.data?.detail;
      if (typeof detail === 'string') {
        alert(`Update failed: ${detail}`);
      } else if (Array.isArray(detail)) {
        alert(`Update failed: ${detail.map(d => d.msg).join(', ')}`);
      } else {
        alert("Failed to update pet. Please check your inputs and try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Loading...">
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent" />
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
      pageTitle={`Edit ${formData.name || "Pet"}`}
      pageDescription="Modify pet profile settings."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header navigation bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/pets/${id}`)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <DashboardHeader
              title={`Edit ${formData.name || "Pet"}`}
              subtitle="Keep your pet's configuration profile up to date."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/pets/${id}`)}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-600 transition-all hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-bold text-white transition-all hover:bg-slate-800 shadow-sm disabled:opacity-60"
            >
              <Save size={16} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
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
                className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-all shrink-0 ${
                  isActive
                    ? "border-emerald-500 text-emerald-600 font-extrabold"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
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
