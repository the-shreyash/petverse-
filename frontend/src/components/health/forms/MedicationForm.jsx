import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function MedicationForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "Once daily",
    duration: "7 days",
    startDate: new Date().toISOString().split("T")[0]
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      visitDate: formData.startDate || new Date().toISOString().split("T")[0],
      veterinarian: "Dr. Sarah Wilson",
      clinic: "Oakwood Veterinary Hospital",
      healthScore: 90,
      weight: 0,
      temperature: 0,
      heartRate: 0,
      diagnosis: `Prescribed Medication: ${formData.name}`,
      treatment: `Prescribed ${formData.name} course for ${formData.duration}.`,
      prescriptions: [
        {
          name: formData.name,
          dosage: formData.dosage,
          frequency: formData.frequency,
          duration: formData.duration
        }
      ],
      vaccinations: [],
      medications: [
        {
          name: formData.name,
          dosage: formData.dosage,
          frequency: formData.frequency,
          duration: formData.duration,
          completed: false,
          missed: false
        }
      ],
      attachments: [],
      notes: `Configure schedule checklist: ${formData.frequency}`,
      followUpDate: ""
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

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-[30px] border border-white/20 bg-white shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <h3 className="text-lg font-black text-slate-800">Add New Medication</h3>
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
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Medicine Name</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Meloxicam, Clindamycin Drops"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Dosage</label>
              <input
                required
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g. 1.5mg, 3 drops per ear"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Frequency</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none bg-white font-medium text-slate-700 focus:border-emerald-500"
                >
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="3 times daily">3 times daily</option>
                  <option value="Every other day">Every other day</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Duration</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none bg-white font-medium text-slate-700 focus:border-emerald-500"
                >
                  <option value="3 days">3 days</option>
                  <option value="5 days">5 days</option>
                  <option value="7 days">7 days</option>
                  <option value="10 days">10 days</option>
                  <option value="14 days">14 days</option>
                  <option value="30 days">30 days</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Course Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
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
                Save Medication
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
