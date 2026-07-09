import React, { useState } from "react";
import { X, Plus, Trash2, Shield, Calendar, HeartPulse, Scale, Thermometer } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function MedicalRecordForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split("T")[0],
    veterinarian: "",
    clinic: "",
    healthScore: 90,
    weight: "",
    temperature: "",
    heartRate: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    followUpDate: ""
  });

  const [prescriptions, setPrescriptions] = useState([]);
  const [tempPresc, setTempPresc] = useState({ name: "", dosage: "", frequency: "", duration: "" });
  const [attachments, setAttachments] = useState([]);
  const [tempAttach, setTempAttach] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPrescription = () => {
    if (!tempPresc.name) return;
    setPrescriptions((prev) => [...prev, tempPresc]);
    setTempPresc({ name: "", dosage: "", frequency: "", duration: "" });
  };

  const handleRemovePrescription = (idx) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddAttachment = () => {
    if (!tempAttach) return;
    setAttachments((prev) => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        name: tempAttach,
        category: tempAttach.toLowerCase().includes("cert") ? "Certificate" : "Reports",
        uploadDate: new Date().toISOString().split("T")[0],
        url: "#"
      }
    ]);
    setTempAttach("");
  };

  const handleRemoveAttachment = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      healthScore: parseInt(formData.healthScore) || 90,
      weight: parseFloat(formData.weight) || 0,
      temperature: parseFloat(formData.temperature) || 0,
      heartRate: parseInt(formData.heartRate) || 0,
      prescriptions,
      attachments
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
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/20 bg-white shadow-2xl backdrop-blur-xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-6 shrink-0">
            <h3 className="text-xl font-black text-slate-800">Log New Veterinary Record</h3>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Scroll Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
            {/* Primary Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Diagnosis / Reason</label>
                <input
                  required
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  placeholder="e.g. Annual Vaccination Checkup"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Visit Date</label>
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
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Veterinarian Doctor</label>
                <input
                  required
                  type="text"
                  name="veterinarian"
                  value={formData.veterinarian}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Sarah Wilson"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Clinic Name</label>
                <input
                  required
                  type="text"
                  name="clinic"
                  value={formData.clinic}
                  onChange={handleChange}
                  placeholder="e.g. Oakwood Veterinary Hospital"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Vital Signs & Vitals</h4>
              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="e.g. 28.5"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="e.g. 38.4"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    name="heartRate"
                    value={formData.heartRate}
                    onChange={handleChange}
                    placeholder="e.g. 95"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Health Score (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    name="healthScore"
                    value={formData.healthScore}
                    onChange={handleChange}
                    placeholder="e.g. 90"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Prescriptions Add Section */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Prescribe Medications</h4>
              <div className="grid gap-3 sm:grid-cols-4 items-end bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Medicine Name</label>
                  <input
                    type="text"
                    placeholder="Anotix Drops"
                    value={tempPresc.name}
                    onChange={(e) => setTempPresc({ ...tempPresc, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Dosage</label>
                  <input
                    type="text"
                    placeholder="3 drops per ear"
                    value={tempPresc.dosage}
                    onChange={(e) => setTempPresc({ ...tempPresc, dosage: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Frequency</label>
                  <input
                    type="text"
                    placeholder="Twice daily"
                    value={tempPresc.frequency}
                    onChange={(e) => setTempPresc({ ...tempPresc, frequency: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="7 days"
                      value={tempPresc.duration}
                      onChange={(e) => setTempPresc({ ...tempPresc, duration: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPrescription}
                    className="rounded-lg bg-emerald-500 text-white p-2 shrink-0 hover:bg-emerald-600 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Added prescriptions list */}
              {prescriptions.length > 0 && (
                <div className="mt-3.5 space-y-2">
                  {prescriptions.map((pr, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                      <div>
                        <span className="text-xs font-bold text-slate-800">{pr.name}</span>
                        <span className="text-[10px] text-slate-500 font-medium block">
                          {pr.dosage} • {pr.frequency} ({pr.duration})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePrescription(idx)}
                        className="text-slate-400 hover:text-rose-500 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Document Attachments */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Attach Medical Documents</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Lab_Report_Luna.pdf"
                  value={tempAttach}
                  onChange={(e) => setTempAttach(e.target.value)}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="rounded-2xl bg-slate-900 text-white px-5 py-3 text-sm font-bold hover:bg-slate-800 transition shrink-0"
                >
                  Attach
                </button>
              </div>

              {attachments.length > 0 && (
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {attachments.map((att, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold">
                      <span className="text-slate-700">{att.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details & Notes */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Treatment Performed</label>
                <textarea
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  placeholder="Describe standard procedures performed..."
                  rows={2}
                  className="w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-emerald-500 resize-none transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Clinic Notes & Directives</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Clinical notes, diet advice, behavior checklists..."
                  rows={2}
                  className="w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-emerald-500 resize-none transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Follow-Up Checkup Date (Optional)</label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 shrink-0">
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
                Save Record
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
