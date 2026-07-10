import React from "react";
import { Heart, Activity, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import HealthScoreChart from "../charts/HealthScoreChart";

export default function HealthScoreCard({ score = 90, petName = "Luna" }) {
  const getScoreDetails = (val) => {
    if (val >= 85) {
      return {
        label: "Excellent Wellness",
        desc: `${petName} is in peak condition! All vitals and immunizations are current.`,
        color: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-50/50",
        textColor: "text-emerald-700",
        icon: Heart,
        iconColor: "text-emerald-500"
      };
    }
    if (val >= 60) {
      return {
        label: "Attention Suggested",
        desc: `${petName} has booster vaccinations or checkups due soon.`,
        color: "from-amber-500 to-orange-500",
        bg: "bg-amber-50/50",
        textColor: "text-amber-700",
        icon: Activity,
        iconColor: "text-amber-500"
      };
    }
    return {
      label: "Needs Veterinary Care",
      desc: `Alert: Critical updates pending. Arrange a veterinary examination for ${petName}.`,
      color: "from-rose-500 to-red-500",
      bg: "bg-rose-50/50",
      textColor: "text-rose-700",
      icon: AlertCircle,
      iconColor: "text-rose-500"
    };
  };

  const details = getScoreDetails(score);
  const Icon = details.icon;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Side: Score Text & Description */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${details.textColor} ${details.bg}`}>
              {details.label}
            </span>
          </div>

          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            Wellness Assessment
          </h3>

          <p className="text-sm font-semibold leading-relaxed text-slate-500 max-w-sm">
            {details.desc}
          </p>

          {/* Quick Stats Bar */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mt-2">
            <Sparkles size={14} className="text-emerald-500" />
            <span>Updates hourly based on logs & compliance</span>
          </div>
        </div>

        {/* Right Side: Radial Chart */}
        <div className="flex shrink-0 items-center justify-center p-2 bg-slate-50/50 rounded-3xl border border-slate-100 shadow-inner">
          <HealthScoreChart score={score} size={110} strokeWidth={8} />
        </div>
      </div>
    </motion.div>
  );
}
