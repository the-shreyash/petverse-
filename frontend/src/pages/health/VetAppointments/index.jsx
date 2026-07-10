import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { useHealth } from "@/hooks/useHealth";
import { Plus, CalendarDays, ClipboardList, UserCheck, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components & Cards
import AppointmentCard from "@/components/health/cards/AppointmentCard";
import AppointmentForm from "@/components/health/forms/AppointmentForm";
import DoctorCard from "@/components/health/shared/DoctorCard";

export default function VetAppointmentsView() {
  const {
    pets,
    selectedPet,
    changeSelectedPet,
    appointments,
    addAppointment,
    updateAppointment
  } = useHealth();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!selectedPet) {
    return (
      <DashboardLayout pageTitle="Vet Appointments" pageDescription="Schedule clinic visits.">
        <div className="flex h-64 items-center justify-center">
          <p className="font-bold text-slate-400">Loading schedules index...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Filter based on checkup status
  const upcomingApts = appointments.filter((a) => a.status === "Upcoming" || a.status === "Scheduled");
  const completedApts = appointments.filter((a) => a.status === "Completed" || a.status === "Past");
  const cancelledApts = appointments.filter((a) => a.status === "Cancelled");

  const getFilteredAppointments = () => {
    if (activeTab === "past") return completedApts;
    if (activeTab === "cancelled") return cancelledApts;
    return upcomingApts;
  };

  const displayedApts = getFilteredAppointments();

  // Clinic doctors list
  const clinicDoctors = [
    { name: "Dr. Sarah Wilson", specialty: "General & Canine Care", phone: "+1 (555) 019-2831", email: "dr.wilson@oakwoodvet.com" },
    { name: "Dr. John Carter", specialty: "Feline Internal Medicine", phone: "+1 (555) 019-5544", email: "dr.carter@oakwoodvet.com" }
  ];

  return (
    <DashboardLayout
      pageTitle={`${selectedPet.name} - Vet Appointments`}
      pageDescription="Book, reschedule, or review examinations and general veterinary consultations."
    >
      <div className="space-y-8">
        {/* Header Toggle & Booking button */}
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
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`border-b-2 px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === "upcoming" ? "border-emerald-500 text-emerald-600 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Upcoming ({upcomingApts.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`border-b-2 px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === "past" ? "border-emerald-500 text-emerald-600 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Completed / Past ({completedApts.length})
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`border-b-2 px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === "cancelled" ? "border-emerald-500 text-emerald-600 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Cancelled ({cancelledApts.length})
          </button>
        </div>

        {/* Layout Grid (Left: Appointments list, Right: Vet directory) */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Appointments Grid */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {displayedApts.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  {displayedApts.map((apt) => (
                    <motion.div
                      key={apt.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AppointmentCard
                        appointment={apt}
                        onCancel={(id) => updateAppointment(id, { status: "Cancelled" })}
                        onReschedule={(id) => {
                          const nextDate = prompt("Enter new date (YYYY-MM-DD):");
                          const nextTime = prompt("Enter new time (e.g. 11:30 AM):");
                          if (nextDate && nextTime) {
                            updateAppointment(id, { visitDate: nextDate, time: nextTime });
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center bg-white/50">
                  <CalendarDays className="mx-auto text-slate-300 mb-3" size={40} />
                  <p className="text-slate-400 font-bold text-lg">No appointments listed in this category.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Veterinarians directory panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h4 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <UserCheck size={18} className="text-emerald-500" />
                <span>On-Call Specialists</span>
              </h4>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                Connect directly with our partner medical practitioners at Oakwood Hospital.
              </p>
              
              <div className="space-y-4">
                {clinicDoctors.map((doc, idx) => (
                  <DoctorCard
                    key={idx}
                    name={doc.name}
                    specialty={doc.specialty}
                    phone={doc.phone}
                    email={doc.email}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Scheduler modal */}
        <AppointmentForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={addAppointment}
        />
      </div>
    </DashboardLayout>
  );
}
