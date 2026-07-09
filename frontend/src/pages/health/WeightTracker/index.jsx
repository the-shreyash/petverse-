import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { useHealth } from "@/hooks/useHealth";
import { Scale, Plus, Trash2, Calendar, LineChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button/Button";

// Charts & Components
import WeightChart from "@/components/health/charts/WeightChart";
import GrowthChart from "@/components/health/charts/GrowthChart";
import WeightCard from "@/components/health/cards/WeightCard";

export default function WeightTrackerView() {
  const {
    pets,
    selectedPet,
    changeSelectedPet,
    records,
    addRecord,
    deleteRecord
  } = useHealth();

  const [weightInput, setWeightInput] = useState("");
  const [dateInput, setDateInput] = useState(new Date().toISOString().split("T")[0]);

  if (!selectedPet) {
    return (
      <DashboardLayout pageTitle="Weight Tracker" pageDescription="Log weights.">
        <div className="flex h-64 items-center justify-center">
          <p className="font-bold text-slate-400">Loading growth stats...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Compile weight logs from health records
  const weightLogs = records
    .filter((r) => r.weight > 0)
    .map((r) => ({
      id: r.id,
      date: r.visitDate,
      weight: r.weight
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Determine current weight
  const currentWeight = weightLogs[0] ? weightLogs[0].weight : parseFloat(selectedPet.weight) || 0;

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!weightInput || parseFloat(weightInput) <= 0) return;

    addRecord({
      visitDate: dateInput,
      veterinarian: "Self-logged",
      clinic: "At Home",
      healthScore: 90,
      weight: parseFloat(weightInput),
      temperature: 0,
      heartRate: 0,
      diagnosis: "Weight Check",
      treatment: `Home weight logging: ${weightInput} kg`,
      prescriptions: [],
      vaccinations: [],
      medications: [],
      attachments: [],
      notes: "Routine self-logged biometric monitoring",
      followUpDate: ""
    });
    setWeightInput("");
  };

  return (
    <DashboardLayout
      pageTitle={`${selectedPet.name} - Weight & Growth`}
      pageDescription="Log biometrics, check growth curves against breed averages, and monitor body composition."
    >
      <div className="space-y-8">
        {/* Toggle & Actions Header */}
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
        </div>

        {/* Dashboard Grid layout */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Charts section */}
          <div className="lg:col-span-8 space-y-6">
            {/* Weight Line Chart */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <h4 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <LineChart size={18} className="text-emerald-500" />
                <span>Weight Trend Curve</span>
              </h4>
              <WeightChart data={weightLogs} />
            </div>

            {/* Growth Curves Comparison */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <h4 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Scale size={18} className="text-cyan-500" />
                <span>Breed Median Progression</span>
              </h4>
              <GrowthChart data={weightLogs} breed={selectedPet.breed} />
            </div>
          </div>

          {/* Quick Logs & Records List */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick stats card */}
            <WeightCard weight={currentWeight} history={weightLogs} breed={selectedPet.breed} species={selectedPet.species} />

            {/* Log Weight Form */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h4 className="text-base font-black text-slate-800 tracking-tight">Log Biometric Entry</h4>
              
              <form onSubmit={handleAddLog} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Date</label>
                  <input
                    required
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Weight (kg)</label>
                  <div className="flex gap-2">
                    <input
                      required
                      type="number"
                      step="0.05"
                      placeholder="e.g. 28.5"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                    />
                    <Button type="submit" className="py-2.5 px-4 rounded-xl text-xs shrink-0 flex items-center gap-1">
                      <Plus size={13} />
                      <span>Log</span>
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            {/* Historical Table Log */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h4 className="text-base font-black text-slate-800 tracking-tight">History Log</h4>
              {weightLogs.length > 0 ? (
                <div className="max-h-[220px] overflow-y-auto pr-1 scrollbar-thin space-y-2">
                  {weightLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">
                          {new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-800">{log.weight} kg</span>
                        <button
                          onClick={() => deleteRecord(log.id)}
                          className="text-slate-400 hover:text-rose-500 transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 p-4 text-center rounded-2xl">
                  <p className="text-xs font-bold text-slate-400">No logs listed.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
