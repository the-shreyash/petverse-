import React from "react";
import { ShieldCheck, HeartPulse, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function PetHealthCard({ score = 100 }) {
  // Determine color theme based on score
  const getScoreInfo = (s) => {
    if (s > 85) return { color: "stroke-emerald-500 text-emerald-600 bg-emerald-50", label: "Excellent", text: "text-emerald-700" };
    if (s > 60) return { color: "stroke-amber-500 text-amber-600 bg-amber-50", label: "Good", text: "text-amber-700" };
    return { color: "stroke-rose-500 text-rose-600 bg-rose-50", label: "Needs Care", text: "text-rose-700" };
  };

  const theme = getScoreInfo(score);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200/60
        bg-white/90
        backdrop-blur-md
        p-6
        shadow-sm
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Health Index
          </p>
          <h3 className="mt-1 text-xl font-extrabold text-slate-800">
            Overall Wellness
          </h3>
        </div>
        <div className="rounded-2xl bg-slate-50 p-2.5 text-slate-400">
          <Activity size={20} />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-6">
        {/* SVG Circular Progress */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="h-24 w-24 transform -rotate-95">
            {/* Background ring */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-slate-100 fill-none"
              strokeWidth="8"
            />
            {/* Foreground circle */}
            <motion.circle
              cx="48"
              cy="48"
              r={radius}
              className={`fill-none ${theme.color}`}
              strokeWidth="8"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black text-slate-800">{score}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Score</span>
          </div>
        </div>

        {/* Diagnostic description */}
        <div className="space-y-1">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${theme.color} ${theme.text}`}>
            {theme.label}
          </span>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Your pet's health metrics are tracked regularly. Next vet visit is scheduled.
          </p>
        </div>
      </div>

      {/* Micro Info Cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-slate-50 p-2 text-slate-500 shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Protection</p>
            <p className="text-xs font-bold text-slate-700">Fully Protected</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-slate-50 p-2 text-slate-500 shrink-0">
            <HeartPulse size={16} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Vitality</p>
            <p className="text-xs font-bold text-slate-700">High energy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
