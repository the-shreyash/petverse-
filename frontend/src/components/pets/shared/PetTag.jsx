import React from "react";

export default function PetTag({ icon: Icon, label, value, variant = "glass" }) {
  const variants = {
    glass: "bg-white/60 border-slate-200/50 text-slate-700 shadow-sm backdrop-blur-md",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    cyan: "bg-cyan-50 border-cyan-100 text-cyan-700",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
  };

  return (
    <div
      className={`
        inline-flex
        items-center
        gap-2
        rounded-2xl
        border
        px-3.5
        py-2
        text-sm
        font-medium
        ${variants[variant] || variants.glass}
      `}
    >
      {Icon && <Icon size={16} className="text-slate-400 shrink-0" />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
        {label && <span className="text-xs text-slate-500 font-normal">{label}:</span>}
        <span className="font-semibold text-slate-800">{value}</span>
      </div>
    </div>
  );
}
