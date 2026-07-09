import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function PetStatisticCard({ title, value, unit = "", icon: Icon, delta, deltaType = "neutral", color = "emerald" }) {
  const colorThemes = {
    emerald: "from-emerald-500/10 to-emerald-500/5 text-emerald-600 border-emerald-100/50",
    cyan: "from-cyan-500/10 to-cyan-500/5 text-cyan-600 border-cyan-100/50",
    amber: "from-amber-500/10 to-amber-500/5 text-amber-600 border-amber-100/50",
    rose: "from-rose-500/10 to-rose-500/5 text-rose-600 border-rose-100/50",
  };

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
        flex
        flex-col
        justify-between
        h-full
      "
    >
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          {Icon && (
            <div className={`rounded-2xl border p-2 bg-gradient-to-br ${colorThemes[color] || colorThemes.emerald}`}>
              <Icon size={18} />
            </div>
          )}
        </div>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-black text-slate-800 tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-sm font-bold text-slate-400">
              {unit}
            </span>
          )}
        </div>
      </div>

      {delta && (
        <div className="mt-4 flex items-center gap-1.5 border-t border-slate-50 pt-3">
          {deltaType === "increase" ? (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <ArrowUpRight size={12} />
            </div>
          ) : deltaType === "decrease" ? (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <ArrowDownRight size={12} />
            </div>
          ) : null}
          <span className="text-xs font-bold text-slate-500">
            {delta}
          </span>
        </div>
      )}
    </div>
  );
}
