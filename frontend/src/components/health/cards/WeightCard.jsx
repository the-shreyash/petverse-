import React from "react";
import { Scale, TrendingUp, TrendingDown, Info, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function WeightCard({
  weight,
  history = [],
  species = "Dog",
  breed = "Golden Retriever",
  onAddLog
}) {
  // Compute monthly weight trend
  const getTrend = () => {
    if (history.length < 2) return { value: 0, text: "Stable", type: "neutral" };
    const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    const current = sorted[0].weight;
    const previous = sorted[1].weight;
    const diff = current - previous;
    if (diff > 0.05) return { value: diff.toFixed(1), text: `+${diff.toFixed(1)} kg`, type: "up" };
    if (diff < -0.05) return { value: diff.toFixed(1), text: `${diff.toFixed(1)} kg`, type: "down" };
    return { value: 0, text: "Stable", type: "neutral" };
  };

  const trend = getTrend();

  // Reference ranges based on common breed definitions
  const getBreedReference = () => {
    const b = breed.toLowerCase();
    const s = species.toLowerCase();
    if (b.includes("golden")) return { range: "25.0 - 34.0 kg", status: "Optimal Weight" };
    if (b.includes("persian")) return { range: "3.5 - 5.5 kg", status: "Optimal Weight" };
    if (b.includes("german")) return { range: "30.0 - 40.0 kg", status: "Optimal Weight" };
    if (s === "cat") return { range: "3.5 - 6.0 kg", status: "Standard Range" };
    return { range: "10.0 - 35.0 kg", status: "Standard Range" };
  };

  const refInfo = getBreedReference();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 shadow-inner">
            <Scale size={20} />
          </div>
          <div>
            <h4 className="text-base font-black text-slate-800 tracking-tight">Body Weight</h4>
            <p className="mt-0.5 text-xs text-slate-500 font-semibold">{breed}</p>
          </div>
        </div>

        {onAddLog && (
          <button
            onClick={onAddLog}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300"
            title="Log New Weight"
          >
            <Plus size={15} />
          </button>
        )}
      </div>

      {/* Main Reading */}
      <div className="mt-5 flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-black tracking-tight text-slate-800">
            {weight ? `${parseFloat(weight).toFixed(1)}` : "--"}
          </span>
          <span className="text-sm font-extrabold text-slate-500 ml-1">kg</span>
        </div>

        {/* Trend Indicator */}
        {trend.type !== "neutral" ? (
          <div
            className={`
              flex
              items-center
              gap-1
              rounded-full
              px-2.5
              py-1
              text-xs
              font-bold
              ${
                trend.type === "up"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              }
            `}
          >
            {trend.type === "up" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{trend.text} vs prev</span>
          </div>
        ) : (
          <span className="text-xs font-semibold text-slate-400">Stable weight</span>
        )}
      </div>

      {/* Breed Ref Banner */}
      <div className="mt-5 rounded-2xl bg-slate-50 p-3 border border-slate-100/50 space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <Info size={12} className="text-emerald-500" />
          <span>Breed Reference standard</span>
        </div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Standard range:</span>
          <span>{refInfo.range}</span>
        </div>
        <div className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>{refInfo.status}</span>
        </div>
      </div>
    </motion.div>
  );
}
