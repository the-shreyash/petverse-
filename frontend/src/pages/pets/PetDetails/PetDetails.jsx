import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Activity, ShieldCheck, HeartPulse, Scale, Coffee, Image as ImageIcon, FileText, Bot, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import { getStoredPets, saveStoredPets } from "@/mock/pets";

// Subcomponents imports
import PetHeader from "@/components/pets/shared/PetHeader";
import PetInformationGrid from "@/components/pets/shared/PetInformationGrid";
import PetHealthCard from "@/components/pets/cards/PetHealthCard";
import PetStatisticCard from "@/components/pets/cards/PetStatisticCard";
import VaccinationTimeline from "@/components/pets/timeline/VaccinationTimeline";
import MedicalTimeline from "@/components/pets/timeline/MedicalTimeline";
import WeightTimeline from "@/components/pets/timeline/WeightTimeline";
import FeedingCard from "@/components/pets/feeding/FeedingCard";
import PhotoUploader from "@/components/pets/forms/PhotoUploader";
import DocumentUploader from "@/components/pets/forms/DocumentUploader";

export default function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const list = getStoredPets();
    const found = list.find((p) => p.id === id);
    if (!found) {
      navigate("/pets");
    } else {
      setPet(found);
    }
  }, [id, navigate]);

  const handleDelete = () => {
    const list = getStoredPets();
    const updated = list.filter((p) => p.id !== id);
    saveStoredPets(updated);
    navigate("/pets");
  };

  const handleUpdatePet = (fields) => {
    const list = getStoredPets();
    const updatedList = list.map((p) => {
      if (p.id === id) {
        const next = { ...p, ...fields };
        setPet(next);
        return next;
      }
      return p;
    });
    saveStoredPets(updatedList);
  };

  if (!pet) {
    return (
      <DashboardLayout pageTitle="Loading Profile...">
        <div className="flex h-64 items-center justify-center">
          <p className="text-slate-500 font-bold">Loading Pet Profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: Activity },
    { id: "medical", name: "Medical & Vax", icon: ShieldCheck },
    { id: "nutrition", name: "Nutrition", icon: Coffee },
    { id: "gallery", name: "Gallery & Files", icon: ImageIcon }
  ];

  // Dynamic AI Insight generation based on pet metrics
  const getAiInsight = () => {
    const overdueVax = (pet.vaccinations || []).filter((v) => v.status === "Overdue" || v.status === "Vaccination Due");
    if (overdueVax.length > 0) {
      return `${pet.name} has a wellness index of ${pet.healthScore}%. We detected ${overdueVax.length} vaccination booster schedules pending or due soon (${overdueVax.map((v) => v.name).join(", ")}). Consider scheduling a consultation soon.`;
    }
    return `${pet.name}'s wellness score is at an optimal ${pet.healthScore}%. Feeding schedule appears regular, and weight fluctuations match standard progression. Keep up the excellent care!`;
  };

  return (
    <DashboardLayout
      pageTitle={`${pet.name} Profile`}
      pageDescription="Detailed health card and metrics."
    >
      <div className="space-y-8">
        {/* Profile Header */}
        <PetHeader pet={pet} onDelete={handleDelete} />

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
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

        {/* Tab Panel Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {activeTab === "overview" && (
              <>
                {/* AI Insights Banner */}
                <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-6 shadow-sm flex items-start gap-4">
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-3 text-white shrink-0 shadow-md">
                    <Bot size={22} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-800 flex items-center gap-1.5">
                      AI PetCare Vet-Insights
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600 uppercase">Beta</span>
                    </h4>
                    <p className="mt-1.5 text-sm text-slate-600 font-medium leading-relaxed">
                      {getAiInsight()}
                    </p>
                  </div>
                </div>

                {/* Dashboard grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  <PetHealthCard score={pet.healthScore} />
                  <div className="grid gap-6 grid-cols-2">
                    <PetStatisticCard
                      title="Weight"
                      value={pet.weight}
                      unit="kg"
                      icon={Scale}
                      color="cyan"
                      delta={
                        pet.weightHistory && pet.weightHistory.length > 1
                          ? `${(pet.weightHistory[pet.weightHistory.length - 1].weight - pet.weightHistory[0].weight).toFixed(1)} kg overall change`
                          : "Stable"
                      }
                      deltaType={
                        pet.weightHistory && pet.weightHistory.length > 1
                          ? pet.weightHistory[pet.weightHistory.length - 1].weight > pet.weightHistory[0].weight
                            ? "increase"
                            : "decrease"
                          : "neutral"
                      }
                    />
                    <PetStatisticCard
                      title="Health Index"
                      value={`${pet.healthScore}%`}
                      unit=""
                      icon={HeartPulse}
                      color="rose"
                      delta={pet.healthScore > 85 ? "Excellent protection" : "Consult recommended"}
                      deltaType="neutral"
                    />
                  </div>
                </div>

                {/* Detailed Information Grid */}
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-slate-800">Pet Identity Profile</h3>
                  <PetInformationGrid pet={pet} />
                </div>

                {/* Appointments Overview */}
                <div className="rounded-3xl border border-slate-200/60 bg-white/90 backdrop-blur-md p-6 shadow-sm">
                  <h3 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-emerald-500" />
                    Scheduled Vet Appointments
                  </h3>
                  {pet.appointments && pet.appointments.length > 0 ? (
                    <div className="space-y-3">
                      {pet.appointments.map((apt) => (
                        <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-50/50 p-4 border border-slate-100">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{apt.reason}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Doctor: {apt.doctor}</p>
                          </div>
                          <div className="mt-2 sm:mt-0 text-left sm:text-right shrink-0">
                            <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-bold border border-emerald-100">
                              {apt.date} • {apt.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider py-4">No upcoming consultations.</p>
                  )}
                </div>
              </>
            )}

            {activeTab === "medical" && (
              <div className="grid gap-6 md:grid-cols-2 items-start">
                <div className="space-y-6">
                  <VaccinationTimeline vaccinations={pet.vaccinations} />
                  <MedicalTimeline medicalHistory={pet.medicalHistory} />
                </div>
                <div>
                  <WeightTimeline weightHistory={pet.weightHistory} />
                </div>
              </div>
            )}

            {activeTab === "nutrition" && (
              <div className="max-w-3xl">
                <FeedingCard feedingPreferences={pet.feedingPreferences} />
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="grid gap-6 md:grid-cols-2 items-start">
                {/* Photo Gallery Grid */}
                <div className="rounded-3xl border border-slate-200/60 bg-white/90 backdrop-blur-md p-6 shadow-sm space-y-6">
                  <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                    <ImageIcon size={20} className="text-emerald-500" />
                    Photo Gallery
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(pet.gallery || []).map((url, index) => (
                      <div key={index} className="relative h-24 rounded-2xl overflow-hidden border border-slate-100 group shadow-inner">
                        <img src={url} alt={`Gallery ${index}`} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      </div>
                    ))}
                  </div>
                  <PhotoUploader
                    formData={pet}
                    errors={{}}
                    updateFields={(fields) => {
                      if (fields.profileImage) {
                        handleUpdatePet({
                          profileImage: fields.profileImage,
                          gallery: [...(pet.gallery || []), fields.profileImage]
                        });
                      }
                    }}
                  />
                </div>

                {/* Documents list & uploader */}
                <div className="rounded-3xl border border-slate-200/60 bg-white/90 backdrop-blur-md p-6 shadow-sm space-y-6">
                  <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                    <FileText size={20} className="text-emerald-500" />
                    Medical Documents
                  </h3>
                  <DocumentUploader
                    formData={pet}
                    updateFields={(fields) => {
                      if (fields.documents) {
                        handleUpdatePet({ documents: fields.documents });
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
