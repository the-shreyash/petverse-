import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { useHealth } from "@/hooks/useHealth";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Activity,
  Calendar,
  Scale,
  Pill,
  FileText,
  AlertTriangle,
  Stethoscope,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

// Health Components
import HealthScoreCard from "@/components/health/cards/HealthScoreCard";
import VitalSignsCard from "@/components/health/shared/VitalSignsCard";
import MedicationCard from "@/components/health/cards/MedicationCard";
import AppointmentCard from "@/components/health/cards/AppointmentCard";
import MedicalRecordCard from "@/components/health/cards/MedicalRecordCard";
import DocumentCard from "@/components/health/cards/DocumentCard";
import MedicalTimeline from "@/components/health/timeline/MedicalTimeline";
import DocumentPreview from "@/components/health/shared/DocumentPreview";

export default function HealthDashboard() {
  const {
    pets,
    selectedPetId,
    selectedPet,
    changeSelectedPet,
    records,
    appointments,
    updateAppointment
  } = useHealth();

  const [activeDoc, setActiveDoc] = useState(null);

  if (!selectedPet) {
    return (
      <DashboardLayout pageTitle="Health & Veterinary" pageDescription="Check vitals, vaccines, and medical history.">
        <div className="flex h-64 items-center justify-center rounded-[30px] border border-dashed border-slate-200 bg-white">
          <p className="font-bold text-slate-400">Loading central health engine...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Extract recent metrics from records
  const latestRecord = records[0] || null;
  const currentWeight = latestRecord ? latestRecord.weight : parseFloat(selectedPet.weight) || 0;
  const currentTemp = latestRecord ? latestRecord.temperature : 38.4;
  const currentHR = latestRecord ? latestRecord.heartRate : 92;

  // Extract active medications (medications from all records)
  const activeMedications = [];
  records.forEach((r) => {
    if (r.medications && r.medications.length > 0) {
      r.medications.forEach((m) => {
        if (!m.completed) activeMedications.push(m);
      });
    }
  });

  // Extract all documents
  const allAttachments = [];
  records.forEach((r) => {
    if (r.attachments && r.attachments.length > 0) {
      r.attachments.forEach((a) => allAttachments.push(a));
    }
  });

  const nextAppointment = appointments.find((a) => a.status === "Upcoming") || null;

  const quickLinks = [
    { label: "Records", path: "/health/records", icon: Stethoscope, color: "text-emerald-500 bg-emerald-50" },
    { label: "Vaccines", path: "/health/vaccinations", icon: Activity, color: "text-teal-500 bg-teal-50" },
    { label: "Medications", path: "/health/medications", icon: Pill, color: "text-indigo-500 bg-indigo-50" },
    { label: "Weight", path: "/health/weight", icon: Scale, color: "text-cyan-500 bg-cyan-50" },
    { label: "Appointments", path: "/health/appointments", icon: Calendar, color: "text-amber-500 bg-amber-50" },
    { label: "Emergency", path: "/health/emergency", icon: AlertTriangle, color: "text-rose-500 bg-rose-50" }
  ];

  return (
    <DashboardLayout
      pageTitle="Health & Veterinary"
      pageDescription="Single source of truth for pet clinical diagnostics and records."
    >
      <div className="space-y-8">
        {/* Selector & Navigation Bar */}
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          {/* Pet Selector Cards */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {pets.map((p) => {
              const isSelected = p.id === selectedPetId;
              return (
                <button
                  key={p.id}
                  onClick={() => changeSelectedPet(p.id)}
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-full
                    border
                    px-4
                    py-2
                    text-sm
                    font-black
                    transition-all
                    shrink-0
                    ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }
                  `}
                >
                  <img
                    src={p.profileImage || p.image}
                    alt={p.name}
                    className="h-7 w-7 rounded-full object-cover border border-slate-200"
                  />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    px-3.5
                    py-2
                    text-xs
                    font-bold
                    text-slate-600
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-sm
                    hover:border-slate-300
                  "
                >
                  <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${link.color}`}>
                    <Icon size={12} />
                  </div>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Panel: Vitals, Cards & Checklist */}
          <div className="lg:col-span-7 space-y-6">
            {/* Wellness Ring Assessment */}
            <HealthScoreCard score={selectedPet.healthScore || 90} petName={selectedPet.name} />

            {/* Vitals grid */}
            <VitalSignsCard
              temperature={currentTemp}
              heartRate={currentHR}
              species={selectedPet.species}
            />

            {/* Weight Quick Card */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-slate-800 tracking-tight">Recent Weight Log</h4>
                <Link to="/health/weight" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                  <span>Log history</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div>
                  <span className="text-3xl font-black text-slate-800">{currentWeight}</span>
                  <span className="text-xs font-extrabold text-slate-400 ml-1">kg</span>
                </div>
                <div className="text-xs font-bold text-slate-400 border-l border-slate-200 pl-4 py-1">
                  Breed range: {selectedPet.species === "Cat" ? "3.5 - 5.5 kg" : "25.0 - 34.0 kg"}
                </div>
              </div>
            </div>

            {/* Upcoming Appointment */}
            {nextAppointment ? (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Next Checkup</h4>
                <AppointmentCard
                  appointment={nextAppointment}
                  onCancel={(id) => updateAppointment(id, { status: "Cancelled" })}
                />
              </div>
            ) : (
              <div className="rounded-[30px] border border-slate-200 bg-white p-6 text-center">
                <p className="text-sm font-semibold text-slate-400">No scheduled appointments.</p>
                <Link
                  to="/health/appointments"
                  className="mt-3.5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                >
                  Schedule Consultation
                </Link>
              </div>
            )}

            {/* Active Medications checklist */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h4 className="text-lg font-black text-slate-800 tracking-tight">Active Medications Today</h4>
              {activeMedications.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {activeMedications.map((med, idx) => (
                    <MedicationCard key={idx} medication={med} />
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 p-4 text-center rounded-2xl">
                  <p className="text-xs font-bold text-slate-400">No prescriptions scheduled for today.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Health timeline & Documents */}
          <div className="lg:col-span-5 space-y-6">
            {/* Unified chronological timeline */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h4 className="text-lg font-black text-slate-800 tracking-tight">Clinical Timeline</h4>
                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Secure Feed</span>
              </div>
              <div className="max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                <MedicalTimeline records={records} appointments={appointments} petName={selectedPet.name} />
              </div>
            </div>

            {/* Documents preview index */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h4 className="text-lg font-black text-slate-800 tracking-tight">Uploaded Health Files</h4>
              {allAttachments.length > 0 ? (
                <div className="grid gap-3 grid-cols-2">
                  {allAttachments.slice(0, 4).map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onPreview={(file) => setActiveDoc(file)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 p-4 text-center rounded-2xl">
                  <p className="text-xs font-bold text-slate-400">No medical certifications uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Document preview overlay */}
        <DocumentPreview
          isOpen={!!activeDoc}
          onClose={() => setActiveDoc(null)}
          document={activeDoc}
        />
      </div>
    </DashboardLayout>
  );
}
