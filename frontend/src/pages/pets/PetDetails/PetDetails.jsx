import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Activity, ShieldCheck, HeartPulse, Scale, Coffee, Image as ImageIcon, FileText, Bot, Calendar, Trash2, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import api from "@/services/api";

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

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8000";

function getImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
  return `${BACKEND_URL}${url}`;
}

export default function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }

      try {
        setLoading(true);
        const response = await api.get(`/pets/${id}`);
        const petData = response.data?.data || response.data;
        setPet(petData);
      } catch (err) {
        console.error("Error fetching pet", err);
        if (err?.response?.status === 404) {
          navigate("/pets");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to remove ${pet?.name}? This cannot be undone.`)) return;
    try {
      setDeleting(true);
      await api.delete(`/pets/${id}`);
      navigate("/pets");
    } catch (err) {
      console.error("Error deleting pet", err);
      alert("Failed to delete pet. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdatePet = async (fields) => {
    try {
      const updated = { ...pet, ...fields };
      setPet(updated); // Optimistic update
      await api.patch(`/pets/${id}`, fields);
    } catch (err) {
      console.error("Error updating pet", err);
      // Revert on failure
      setPet(pet);
    }
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Loading Profile...">
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!pet) {
    return (
      <DashboardLayout pageTitle="Pet Not Found">
        <div className="flex h-64 items-center justify-center">
          <p className="text-slate-500 font-bold">Pet not found.</p>
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

  // Normalize pet data for components that expect old field names
  const normalizedPet = {
    ...pet,
    // Map backend field names → frontend component expectations
    birthDate: pet.birth_date,
    profileImage: pet.profile_image ? getImageUrl(pet.profile_image) : null,
    healthScore: pet.health_score || 85, // fallback if not present
    vaccinations: pet.vaccinations || [],
    medicalHistory: pet.medical_records || pet.medicalHistory || [],
    weightHistory: pet.weight_history || [],
    feedingPreferences: pet.feeding_preferences || {},
    appointments: pet.appointments || [],
    gallery: (pet.gallery_images || []).map(g => getImageUrl(g.image_url || g))
  };

  const getAiInsight = () => {
    const overdueVax = normalizedPet.vaccinations.filter(v => v.status === "Overdue" || v.status === "due");
    if (overdueVax.length > 0) {
      return `${pet.name} has ${overdueVax.length} vaccination(s) pending or overdue. Consider scheduling a vet appointment soon.`;
    }
    return `${pet.name} appears to be in good health. Keep up with regular vet check-ups and a balanced diet for optimal wellness!`;
  };

  return (
    <DashboardLayout
      pageTitle={`${pet.name} Profile`}
      pageDescription="Detailed health card and metrics."
    >
      <div className="space-y-8">
        {/* Profile Header */}
        <PetHeader
          pet={normalizedPet}
          onDelete={handleDelete}
          deleting={deleting}
        />

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

        {/* Edit Button */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/pets/${id}/edit`)}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
          >
            <Edit size={15} />
            Edit Pet
          </button>
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

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-2">
                  <PetHealthCard score={normalizedPet.healthScore} />
                  <div className="grid gap-6 grid-cols-2">
                    <PetStatisticCard
                      title="Weight"
                      value={pet.weight || "N/A"}
                      unit={pet.weight ? "kg" : ""}
                      icon={Scale}
                      color="cyan"
                      delta="Stable"
                      deltaType="neutral"
                    />
                    <PetStatisticCard
                      title="Health Index"
                      value={`${normalizedPet.healthScore}%`}
                      unit=""
                      icon={HeartPulse}
                      color="rose"
                      delta={normalizedPet.healthScore > 85 ? "Excellent" : "Needs attention"}
                      deltaType="neutral"
                    />
                  </div>
                </div>

                {/* Pet Information Grid */}
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-slate-800">Pet Identity Profile</h3>
                  <PetInformationGrid pet={normalizedPet} />
                </div>

                {/* Appointments */}
                <div className="rounded-3xl border border-slate-200/60 bg-white/90 backdrop-blur-md p-6 shadow-sm">
                  <h3 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-emerald-500" />
                    Scheduled Vet Appointments
                  </h3>
                  {normalizedPet.appointments.length > 0 ? (
                    <div className="space-y-3">
                      {normalizedPet.appointments.map((apt) => (
                        <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-50/50 p-4 border border-slate-100">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{apt.reason || apt.title}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              {apt.vet_name || apt.doctor || "Vet Clinic"}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0 text-left sm:text-right shrink-0">
                            <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-bold border border-emerald-100">
                              {apt.appointment_date || apt.date} {apt.appointment_time ? `• ${apt.appointment_time}` : ""}
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
                  <VaccinationTimeline vaccinations={normalizedPet.vaccinations} />
                  <MedicalTimeline medicalHistory={normalizedPet.medicalHistory} />
                </div>
                <div>
                  <WeightTimeline weightHistory={normalizedPet.weightHistory} />
                </div>
              </div>
            )}

            {activeTab === "nutrition" && (
              <div className="max-w-3xl">
                <FeedingCard feedingPreferences={normalizedPet.feedingPreferences} />
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="grid gap-6 md:grid-cols-2 items-start">
                {/* Photo Gallery */}
                <div className="rounded-3xl border border-slate-200/60 bg-white/90 backdrop-blur-md p-6 shadow-sm space-y-6">
                  <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                    <ImageIcon size={20} className="text-emerald-500" />
                    Photo Gallery
                  </h3>
                  {normalizedPet.gallery.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {normalizedPet.gallery.map((url, index) => (
                        <div key={index} className="relative h-24 rounded-2xl overflow-hidden border border-slate-100 group shadow-inner">
                          <img src={url} alt={`Gallery ${index}`} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-4">No gallery photos yet.</p>
                  )}
                  <PhotoUploader
                    formData={pet}
                    errors={{}}
                    updateFields={(fields) => {
                      if (fields.profileImage) {
                        handleUpdatePet({ profile_image: fields.profileImage });
                      }
                    }}
                  />
                </div>

                {/* Documents */}
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
