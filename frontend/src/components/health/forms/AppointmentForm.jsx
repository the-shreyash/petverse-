import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function AppointmentForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    reason: "",
    visitDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Default tomorrow
    time: "10:00 AM",
    veterinarian: "Dr. Sarah Wilson",
    clinic: "Oakwood Veterinary Hospital",
    notes: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
            <h3 className="text-lg font-black text-slate-800">Schedule Vet Appointment</h3>
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
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Reason for Visit</label>
              <input
                required
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="e.g. Annual Vaccination Booster, Dental Checkup"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Appointment Date</label>
                <input
                  required
                  type="date"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Preferred Time Slot</label>
                <input
                  required
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g. 10:30 AM"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-medium">Veterinarian</label>
                <select
                  name="veterinarian"
                  value={formData.veterinarian}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none bg-white font-medium text-slate-700 focus:border-emerald-500"
                >
                  <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
                  <option value="Dr. John Carter">Dr. John Carter</option>
                  <option value="Dr. Alex Mitchell">Dr. Alex Mitchell</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-medium">Clinic Facility</label>
                <select
                  name="clinic"
                  value={formData.clinic}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none bg-white font-medium text-slate-700 focus:border-emerald-500"
                >
                  <option value="Oakwood Veterinary Hospital">Oakwood Hospital</option>
                  <option value="Downtown Pet Urgent Care">Downtown Urgent Care</option>
                  <option value="Westside Mobile Vet Clinic">Westside Mobile Clinic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Special Instructions / Prep</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Keep pet fasting for 8 hours prior if blood check is required."
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
                Schedule Checkup
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
