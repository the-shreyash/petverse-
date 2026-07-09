import React from "react";
import { Coffee, ShieldCheck, HeartPulse, Scale, Shield, Calendar } from "lucide-react";
import PetAvatar from "../shared/PetAvatar";
import PetStatusBadge from "../shared/PetStatusBadge";

export default function ReviewCard({ formData }) {
  const getHealthStatus = (score) => {
    if (score > 85) return "Healthy";
    if (score > 60) return "Vaccination Due";
    return "Needs Checkup";
  };

  const feeding = formData.feedingPreferences || {};

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Review Pet Profile</h3>
        <p className="text-sm text-slate-500 mt-1">Please confirm the details are correct before creating the profile.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card Summary */}
        <div className="md:col-span-1 flex flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-white/95 p-6 text-center shadow-sm">
          <PetAvatar
            src={formData.profileImage}
            name={formData.name}
            species={formData.species}
            size="xl"
            status={getHealthStatus(formData.healthScore)}
          />
          <h4 className="text-xl font-bold text-slate-800 mt-4">{formData.name || "Unnamed Pet"}</h4>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
            {formData.breed || "Unknown Breed"} • {formData.species}
          </p>
          <div className="mt-4">
            <PetStatusBadge status={getHealthStatus(formData.healthScore)} />
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Age/Bday */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <Calendar size={14} className="text-emerald-500" />
                <span>Birth Date</span>
              </div>
              <p className="mt-1.5 text-sm font-extrabold text-slate-700">{formData.birthDate || "Not Specified"}</p>
            </div>

            {/* Weight */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <Scale size={14} className="text-cyan-500" />
                <span>Weight</span>
              </div>
              <p className="mt-1.5 text-sm font-extrabold text-slate-700">{formData.weight ? `${formData.weight} kg` : "Not Specified"}</p>
            </div>

            {/* Microchip */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <Shield size={14} className="text-indigo-500" />
                <span>Microchip ID</span>
              </div>
              <p className="mt-1.5 text-sm font-extrabold text-slate-700">{formData.microchip || "Not Microchipped"}</p>
            </div>

            {/* Gender */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <HeartPulse size={14} className="text-rose-500" />
                <span>Gender</span>
              </div>
              <p className="mt-1.5 text-sm font-extrabold text-slate-700">{formData.gender || "Female"}</p>
            </div>
          </div>

          {/* Diet Preferences Info */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <Coffee size={14} className="text-amber-500" />
              <span>Nutrition & Feeding Schedule</span>
            </div>
            <div className="text-sm font-semibold text-slate-700 space-y-1">
              <p>Type: <span className="font-extrabold text-slate-800">{feeding.foodType || "Not Configured"}</span></p>
              <p>Portion: <span className="font-extrabold text-slate-800">{feeding.portionSize || "Not Configured"}</span> • {feeding.frequency}</p>
              {feeding.allergies && feeding.allergies !== "None" && (
                <p className="text-xs text-rose-600">Allergies: <span className="font-bold">{feeding.allergies}</span></p>
              )}
            </div>
          </div>

          {/* Core lists overview */}
          <div className="grid gap-4 grid-cols-3 text-center">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-3">
              <p className="text-lg font-black text-slate-800">{(formData.vaccinations || []).length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vaccines</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-3">
              <p className="text-lg font-black text-slate-800">{(formData.medicalHistory || []).length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diagnoses</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-3">
              <p className="text-lg font-black text-slate-800">{(formData.documents || []).length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Files</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
