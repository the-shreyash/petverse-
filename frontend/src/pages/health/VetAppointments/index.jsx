import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { useHealth } from "@/hooks/useHealth";
import { Plus, CalendarDays, UserCheck, MapPin, Loader2, Star, Phone, X } from "lucide-react";
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
    updateAppointment,
    deleteAppointment,
    searchClinics
  } = useHealth();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Reschedule modal state
  const [rescheduleApt, setRescheduleApt] = useState(null);
  const [resDate, setResDate] = useState("");
  const [resTime, setResTime] = useState("10:00");

  // Clinic search state
  const [clinicResults, setClinicResults] = useState(null);
  const [clinicLoading, setClinicLoading] = useState(false);
  const [clinicError, setClinicError] = useState(null);

  const openReschedule = (apt) => {
    setRescheduleApt(apt);
    setResDate(apt.visitDate ? new Date(apt.visitDate).toISOString().split("T")[0] : "");
    setResTime("10:00");
  };

  const confirmReschedule = async () => {
    if (!rescheduleApt || !resDate) return;
    await updateAppointment(rescheduleApt.id, { visitDate: resDate, time: resTime, status: "Scheduled" });
    setRescheduleApt(null);
  };

  const findNearbyClinics = () => {
    setClinicError(null);
    setClinicLoading(true);
    if (!navigator.geolocation) {
      setClinicError("Geolocation is not supported by this browser.");
      setClinicLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const results = await searchClinics(pos.coords.latitude, pos.coords.longitude);
          setClinicResults(results);
        } catch {
          setClinicError("Could not fetch clinics. Please try again.");
        } finally {
          setClinicLoading(false);
        }
      },
      () => {
        setClinicError("Location permission denied.");
        setClinicLoading(false);
      }
    );
  };

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
                        onReschedule={() => openReschedule(apt)}
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

          {/* Clinic search + Veterinarians directory panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Nearby clinics */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h4 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <MapPin size={18} className="text-cyan-500" />
                <span>Find Clinics Near You</span>
              </h4>
              <button
                onClick={findNearbyClinics}
                disabled={clinicLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm font-bold text-cyan-700 hover:bg-cyan-100 transition disabled:opacity-60"
              >
                {clinicLoading ? <Loader2 size={15} className="animate-spin" /> : <MapPin size={15} />}
                {clinicLoading ? "Locating…" : "Search nearby clinics"}
              </button>
              {clinicError && <p className="text-xs font-semibold text-rose-500">{clinicError}</p>}
              {clinicResults && clinicResults.length === 0 && (
                <p className="text-xs font-semibold text-slate-400">No clinics found nearby.</p>
              )}
              {clinicResults && clinicResults.length > 0 && (
                <div className="space-y-2.5">
                  {clinicResults.map((c) => (
                    <div key={c.provider_id || c.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-800 truncate">{c.name}</p>
                        {c.rating != null && (
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0">
                            <Star size={12} fill="currentColor" /> {c.rating}
                          </span>
                        )}
                      </div>
                      {c.address && <p className="text-xs text-slate-400 font-semibold mt-0.5">{c.address}</p>}
                      <div className="mt-2 flex items-center gap-2">
                        {c.phone && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                            <Phone size={11} /> {c.phone}
                          </span>
                        )}
                        <button
                          onClick={() => setIsFormOpen(true)}
                          className="ml-auto rounded-lg bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-600 transition"
                        >
                          Book here
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specialists directory */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h4 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <UserCheck size={18} className="text-emerald-500" />
                <span>On-Call Specialists</span>
              </h4>
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

        {/* Reschedule modal */}
        {rescheduleApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] p-7 max-w-sm w-full shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-800">Reschedule Appointment</h3>
                <button onClick={() => setRescheduleApt(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition">
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-400 mb-4">{rescheduleApt.reason}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">New date</label>
                  <input type="date" value={resDate} onChange={(e) => setResDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:bg-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">New time</label>
                  <input type="time" value={resTime} onChange={(e) => setResTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:bg-white" />
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => setRescheduleApt(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={confirmReschedule} disabled={!resDate}
                  className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition disabled:opacity-50">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
