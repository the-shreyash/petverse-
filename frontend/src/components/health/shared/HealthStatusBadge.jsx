import React from "react";
import { motion } from "framer-motion";

const statusStyles = {
  // Green/Emerald
  Healthy: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200/60",

  // Amber/Yellow
  "Vaccination Due": "bg-amber-50 text-amber-700 border-amber-200/60",
  Upcoming: "bg-cyan-50 text-cyan-700 border-cyan-200/60",
  Scheduled: "bg-cyan-50 text-cyan-700 border-cyan-200/60",
  Pending: "bg-amber-50 text-amber-700 border-amber-200/60",

  // Red/Rose
  "Needs Checkup": "bg-rose-50 text-rose-700 border-rose-200/60",
  Overdue: "bg-rose-50 text-rose-700 border-rose-200/60",
  Critical: "bg-rose-50 text-rose-700 border-rose-200/60",
  Missed: "bg-rose-50 text-rose-700 border-rose-200/60",
  Cancelled: "bg-slate-100 text-slate-500 border-slate-200",

  // Slate/Gray
  Past: "bg-slate-50 text-slate-600 border-slate-200/60",
  Inactive: "bg-slate-50 text-slate-600 border-slate-200/60",
};

export default function HealthStatusBadge({ status, className = "" }) {
  const matchedStyle = statusStyles[status] || "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <motion.span
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-semibold
        tracking-wide
        shadow-sm
        ${matchedStyle}
        ${className}
      `}
    >
      {status}
    </motion.span>
  );
}
