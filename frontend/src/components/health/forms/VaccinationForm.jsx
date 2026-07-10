import React, { useState } from "react";
import { X, ShieldAlert } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function VaccinationForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    status: "Completed",
    dateAdministered: new Date().toISOString().split("T")[0],
    dateDue: "",
    notes: "",
    reminderStatus: "Active"
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build a health checkup container record matching unified schema
    onSubmit({
      visitDate: formData.dateAdministered || new Date().toISOString().split("T")[0],
      veterinarian: "Dr. Sarah Wilson",
      clinic: "Oakwood Veterinary Hospital",
      healthScore: 92,
      weight: 0,
      temperature: 0,
      heartRate: 0,
      diagnosis: `Vaccination: ${formData.name}`,
      treatment: `Administered ${formData.name} vaccination booster.`,
      prescriptions: [],
      vaccinations: [
        {
          name: formData.name,
          status: formData.status,
          dateAdministered: formData.dateAdministered,
          dateDue: formData.dateDue,
          reminderStatus: formData.reminderStatus,
          notes: formData.notes
        }
      ],
      medications: [],
      attachments: [],
      notes: formData.notes,
      followUpDate: formData.dateDue
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-[30px] border border-white/20 bg-white shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <h3 className="text-lg font-black text-slate-800">Log New Vaccination</h3>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Vaccine Name</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. DHPP, Rabies, FVRCP"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none bg-white font-medium text-slate-700 focus:border-emerald-500"
                >
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Reminders</label>
                <select
                  name="reminderStatus"
                  value={formData.reminderStatus}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none bg-white font-medium text-slate-700 focus:border-emerald-500"
                >
                  <option value="Active">Active Reminders</option>
                  <option value="Inactive">Reminders Off</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Administered Date</label>
                <input
                  type="date"
                  name="dateAdministered"
                  value={formData.dateAdministered}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Next Booster Due</label>
                <input
                  required
                  type="date"
                  name="dateDue"
                  value={formData.dateDue}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Booster Notes & Lot #</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. 3-year booster cycle. Lot Number 9931-A."
                rows={3}
                className="w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-emerald-500 resize-none transition"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="py-2.5 px-6 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="py-2.5 px-6 text-sm"
              >
                Save Vaccination
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
