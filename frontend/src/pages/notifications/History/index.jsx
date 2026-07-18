import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarRange, PlusCircle, Bell, Settings, HeartPulse, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import GlassCard from "@/components/ui/GlassCard/GlassCard";
import ReminderCard from "@/components/notifications/cards/ReminderCard";
import EmptyNotification from "@/components/notifications/shared/EmptyNotification";
import { useReminder } from "@/hooks/useReminder";
import { usePets } from "@/hooks/usePets";

export default function ReminderHistoryPage() {
  const { reminders, addReminder, completeReminder, snoozeReminder, deleteReminder } = useReminder();
  const [filter, setFilter] = useState("All"); // All, Upcoming, Completed, Missed
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Feeding"); // Feeding, Medication, Vaccination, Checkup
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState("Once");
  const [petId, setPetId] = useState("");
  const [priority, setPriority] = useState("medium");

  const { pets } = usePets();
  const petsList = pets || [];

  const filteredReminders = reminders.filter((rem) => {
    if (filter === "All") return true;
    return rem.status === filter;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    const selectedPet = petsList.find((p) => p.id === petId) || null;

    addReminder({
      title,
      description,
      type,
      date,
      time: formatTime(time),
      repeat,
      pet: selectedPet ? { id: selectedPet.id, name: selectedPet.name, avatar: selectedPet.profileImage } : null,
      priority
    });

    // Reset Form
    setTitle("");
    setDescription("");
    setType("Feeding");
    setDate("");
    setTime("");
    setRepeat("Once");
    setPetId("");
    setPriority("medium");
    setIsAddFormOpen(false);
  };

  return (
    <DashboardLayout pageTitle="Reminders Tracker" pageDescription="Create and manage your pet's schedule, medication timings, and vaccine logs.">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side Links */}
        <div className="space-y-6 text-left">
          <GlassCard className="p-6" hover={false}>
            <h4 className="font-bold text-slate-800 mb-4">Notification Engine</h4>
            <nav className="space-y-1">
              <Link to="/notifications" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 font-bold text-sm transition">
                <Bell size={16} />
                Notification Logs
              </Link>
              <Link to="/notifications/history" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-sm">
                <CalendarRange size={16} />
                Reminders Tracker
              </Link>
              <Link to="/notifications/preferences" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 font-bold text-sm transition">
                <Settings size={16} />
                Preferences
              </Link>
            </nav>
          </GlassCard>
        </div>

        {/* Middle Main list (Span 3) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Action button */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-left">
            {/* Filter buttons */}
            <div className="flex gap-2">
              {["All", "Upcoming", "Completed", "Missed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`
                    rounded-xl
                    px-4
                    py-2
                    text-xs
                    font-bold
                    transition
                    border
                    outline-none
                    ${
                      filter === status
                        ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                        : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddFormOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 hover:opacity-95 transition outline-none"
            >
              <PlusCircle size={16} />
              Schedule Reminder
            </button>
          </div>

          {/* Form Modal overlay */}
          {isAddFormOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[30px] p-8 max-w-md w-full border border-slate-100 shadow-2xl relative text-left"
              >
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <HeartPulse size={20} className="text-emerald-500" />
                  Schedule New Reminder
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Heartworm Pill, Feeding dinner"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold mt-1.5 focus:border-emerald-400 focus:bg-white outline-none"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Give pill with wet food"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold mt-1.5 focus:border-emerald-400 focus:bg-white outline-none"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold mt-1.5 focus:border-emerald-400 outline-none"
                      >
                        <option value="Feeding">Feeding</option>
                        <option value="Medication">Medication</option>
                        <option value="Vaccination">Vaccination</option>
                        <option value="Checkup">Vet Checkup</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tag Pet</label>
                      <select
                        value={petId}
                        onChange={(e) => setPetId(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold mt-1.5 focus:border-emerald-400 outline-none"
                      >
                        <option value="">None</option>
                        {petsList.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Date</label>
                      <input
                        type="date"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold mt-1.5 focus:border-emerald-400 outline-none"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Time</label>
                      <input
                        type="time"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold mt-1.5 focus:border-emerald-400 outline-none"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Repeat Frequency</label>
                      <select
                        value={repeat}
                        onChange={(e) => setRepeat(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold mt-1.5 focus:border-emerald-400 outline-none"
                      >
                        <option value="Once">Once</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Priority</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold mt-1.5 focus:border-emerald-400 outline-none"
                      >
                        <option value="low">Standard</option>
                        <option value="medium">Medium Alert</option>
                        <option value="high">Urgent Warning</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddFormOpen(false)}
                      className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition"
                    >
                      Schedule Task
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* Checklist grids */}
          <div className="space-y-4">
            {filteredReminders.length > 0 ? (
              filteredReminders.map((rem) => (
                <ReminderCard
                  key={rem.id}
                  reminder={rem}
                  onComplete={completeReminder}
                  onSnooze={snoozeReminder}
                  onDelete={deleteReminder}
                />
              ))
            ) : (
              <EmptyNotification
                title="All Tasks Done!"
                description="No active reminders scheduled for this filter. Your pet's checklists are fully completed."
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Helper to convert "14:30" input to "02:30 PM"
function formatTime(timeStr) {
  let [hours, minutes] = timeStr.split(":");
  hours = parseInt(hours, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}
