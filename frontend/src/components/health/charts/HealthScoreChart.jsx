import React from "react";
import { motion } from "framer-motion";

export default function HealthScoreChart({ score = 90, size = 120, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  // Determine colors based on score
  const getColors = (val) => {
    if (val >= 85) return { stroke: "url(#emerald-teal-gradient)", glow: "shadow-emerald-500/20", text: "text-emerald-600" };
    if (val >= 60) return { stroke: "url(#amber-orange-gradient)", glow: "shadow-amber-500/20", text: "text-amber-600" };
    return { stroke: "url(#rose-red-gradient)", glow: "shadow-rose-500/20", text: "text-rose-600" };
  };

  const colors = getColors(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="emerald-teal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
          <linearGradient id="amber-orange-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="rose-red-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>

        {/* Gray Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />

        {/* Animated Progress Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>

      {/* Center Value */}
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`text-2xl font-black tracking-tight text-slate-800`}
        >
          {score}
        </motion.span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
      </div>
    </div>
  );
}
