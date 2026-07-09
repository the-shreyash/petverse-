import React, { useState } from "react";
import { Plus, Trash2, ShieldCheck, HeartPulse } from "lucide-react";

export default function HealthInformationForm({ formData, updateFields }) {
  const [newVaccine, setNewVaccine] = useState({ name: "", dateAdministered: "", dateDue: "", status: "Completed" });
  const [newMedical, setNewMedical] = useState({ type: "Checkup", date: "", diagnosis: "", notes: "", vet: "" });

  const addVaccine = () => {
    if (!newVaccine.name || !newVaccine.dateAdministered) return;
    const updated = [
      ...(formData.vaccinations || []),
      { ...newVaccine, id: `vac-${Date.now()}` }
    ];
    updateFields({ vaccinations: updated });
    setNewVaccine({ name: "", dateAdministered: "", dateDue: "", status: "Completed" });
  };

  const removeVaccine = (id) => {
    const updated = (formData.vaccinations || []).filter((v) => v.id !== id);
    updateFields({ vaccinations: updated });
  };

  const addMedicalRecord = () => {
    if (!newMedical.diagnosis || !newMedical.date) return;
    const updated = [
      ...(formData.medicalHistory || []),
      { ...newMedical, id: `med-${Date.now()}` }
    ];
    updateFields({ medicalHistory: updated });
    setNewMedical({ type: "Checkup", date: "", diagnosis: "", notes: "", vet: "" });
  };

  const removeMedicalRecord = (id) => {
    const updated = (formData.medicalHistory || []).filter((m) => m.id !== id);
    updateFields({ medicalHistory: updated });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Health Profile</h3>
        <p className="text-sm text-slate-500 mt-1">Configure health metrics and historical wellness records.</p>
      </div>

      {/* Health Score Slider */}
      <div className="rounded-3xl border border-slate-200/60 bg-slate-50/50 p-6">
        <label htmlFor="healthScore" className="flex items-center justify-between font-bold text-slate-700 text-sm">
          <span>Overall Health Score</span>
          <span className="text-emerald-600 text-lg font-black">{formData.healthScore || 90}/100</span>
        </label>
        <input
          type="range"
          id="healthScore"
          min="0"
          max="100"
          value={formData.healthScore || 90}
          onChange={(e) => updateFields({ healthScore: parseInt(e.target.value) })}
          className="w-full mt-4 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-2 font-semibold">
          <span>0 (Critical Care)</span>
          <span>50 (Fair)</span>
          <span>100 (Optimal Health)</span>
        </div>
      </div>

      {/* Vaccinations Section */}
      <div className="space-y-4">
        <h4 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-500" />
          Vaccination Records
        </h4>

        {/* Existing List */}
        {formData.vaccinations && formData.vaccinations.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {formData.vaccinations.map((vac) => (
              <div key={vac.id} className="flex items-center justify-between rounded-2xl bg-white border border-slate-100 p-3 shadow-sm text-sm">
                <div>
                  <p className="font-bold text-slate-800">{vac.name}</p>
                  <p className="text-xs text-slate-400 font-medium">Administered: {vac.dateAdministered} {vac.dateDue && `• Due: ${vac.dateDue}`}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeVaccine(vac.id)}
                  className="rounded-xl p-2 text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Form */}
        <div className="rounded-3xl border border-slate-200/60 p-5 space-y-4 bg-white/70">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Vaccine Name (e.g. Rabies)"
              value={newVaccine.name}
              onChange={(e) => setNewVaccine({ ...newVaccine, name: e.target.value })}
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 bg-white"
            />
            <select
              value={newVaccine.status}
              onChange={(e) => setNewVaccine({ ...newVaccine, status: e.target.value })}
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 bg-white"
            >
              <option value="Completed">Completed</option>
              <option value="Vaccination Due">Upcoming</option>
              <option value="Overdue">Overdue</option>
            </select>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Administered Date</label>
              <input
                type="date"
                value={newVaccine.dateAdministered}
                onChange={(e) => setNewVaccine({ ...newVaccine, dateAdministered: e.target.value })}
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 bg-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Next Due Date (optional)</label>
              <input
                type="date"
                value={newVaccine.dateDue}
                onChange={(e) => setNewVaccine({ ...newVaccine, dateDue: e.target.value })}
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 bg-white"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={addVaccine}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            <Plus size={14} /> Add Vaccine
          </button>
        </div>
      </div>

      {/* Medical History Section */}
      <div className="space-y-4">
        <h4 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <HeartPulse size={18} className="text-rose-500" />
          Medical History & Conditions
        </h4>

        {/* Existing List */}
        {formData.medicalHistory && formData.medicalHistory.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {formData.medicalHistory.map((med) => (
              <div key={med.id} className="flex items-center justify-between rounded-2xl bg-white border border-slate-100 p-3 shadow-sm text-sm">
                <div>
                  <p className="font-bold text-slate-800">{med.diagnosis} ({med.type})</p>
                  <p className="text-xs text-slate-400 font-medium">Date: {med.date} {med.vet && `• Vet: ${med.vet}`}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMedicalRecord(med.id)}
                  className="rounded-xl p-2 text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Form */}
        <div className="rounded-3xl border border-slate-200/60 p-5 space-y-4 bg-white/70">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Diagnosis / Reason (e.g. Sprain)"
              value={newMedical.diagnosis}
              onChange={(e) => setNewMedical({ ...newMedical, diagnosis: e.target.value })}
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 bg-white"
            />
            <select
              value={newMedical.type}
              onChange={(e) => setNewMedical({ ...newMedical, type: e.target.value })}
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 bg-white"
            >
              <option value="Checkup">Checkup</option>
              <option value="Treatment">Treatment</option>
              <option value="Surgery">Surgery</option>
              <option value="Injury">Injury</option>
            </select>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Consult Date</label>
              <input
                type="date"
                value={newMedical.date}
                onChange={(e) => setNewMedical({ ...newMedical, date: e.target.value })}
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 bg-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Veterinarian (optional)</label>
              <input
                type="text"
                placeholder="Dr. Name"
                value={newMedical.vet}
                onChange={(e) => setNewMedical({ ...newMedical, vet: e.target.value })}
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <textarea
                placeholder="Additional Notes..."
                rows="2"
                value={newMedical.notes}
                onChange={(e) => setNewMedical({ ...newMedical, notes: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 bg-white"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={addMedicalRecord}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            <Plus size={14} /> Add Medical Event
          </button>
        </div>
      </div>
    </div>
  );
}
