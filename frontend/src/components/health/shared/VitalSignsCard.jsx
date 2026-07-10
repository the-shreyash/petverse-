import React from "react";
import { Thermometer, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";

export default function VitalSignsCard({
  temperature,
  heartRate,
  species = "Dog",
  className = ""
}) {
  // Simple check for normal ranges for dogs/cats
  const getTempStatus = (temp) => {
    if (!temp) return { label: "N/A", color: "text-slate-500" };
    const t = parseFloat(temp);
    if (species === "Cat") {
      if (t >= 38.0 && t <= 39.2) return { label: "Normal", color: "text-emerald-500 bg-emerald-50" };
      return { label: "Abnormal", color: "text-rose-500 bg-rose-50" };
    } else {
      if (t >= 37.5 && t <= 39.2) return { label: "Normal", color: "text-emerald-500 bg-emerald-50" };
      return { label: "Abnormal", color: "text-rose-500 bg-rose-50" };
    }
  };

  const getHRStatus = (hr) => {
    if (!hr) return { label: "N/A", color: "text-slate-500" };
    const h = parseInt(hr);
    if (species === "Cat") {
      if (h >= 140 && h <= 220) return { label: "Normal", color: "text-emerald-500 bg-emerald-50" };
      return { label: "Elevated / Low", color: "text-amber-500 bg-amber-50" };
    } else {
      if (h >= 70 && h <= 130) return { label: "Normal", color: "text-emerald-500 bg-emerald-50" };
      return { label: "Elevated / Low", color: "text-amber-500 bg-amber-50" };
    }
  };

  const tempStatus = getTempStatus(temperature);
  const hrStatus = getHRStatus(heartRate);

  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>
      {/* Temperature Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
              <Thermometer size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Body Temp</p>
              <h4 className="text-2xl font-black text-slate-800">
                {temperature ? `${temperature} °C` : "--"}
              </h4>
            </div>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${tempStatus.color}`}>
            {tempStatus.label}
          </span>
        </div>
        <div className="mt-4 text-xs font-semibold text-slate-400">
          Ref Range: {species === "Cat" ? "38.0°C - 39.2°C" : "37.5°C - 39.2°C"}
        </div>
      </div>

      {/* Heart Rate Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              {/* Pulse animation using Framer Motion */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "easeInOut"
                }}
              >
                <HeartPulse size={22} />
              </motion.div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Heart Rate</p>
              <h4 className="text-2xl font-black text-slate-800">
                {heartRate ? `${heartRate} bpm` : "--"}
              </h4>
            </div>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${hrStatus.color}`}>
            {hrStatus.label}
          </span>
        </div>
        <div className="mt-4 text-xs font-semibold text-slate-400">
          Ref Range: {species === "Cat" ? "140 bpm - 220 bpm" : "70 bpm - 130 bpm"}
        </div>
      </div>
    </div>
  );
}
