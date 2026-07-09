import React from "react";
import { Scale, Calendar, ChevronRight } from "lucide-react";

export default function WeightTimeline({ weightHistory = [] }) {
  if (!weightHistory || weightHistory.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center bg-white/50">
        <Scale className="mx-auto text-slate-300 mb-3" size={32} />
        <p className="text-slate-400 font-medium">No weight logs recorded.</p>
      </div>
    );
  }

  // Sorting weightHistory chronologically
  const sortedHistory = [...weightHistory].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Determine SVG Dimensions & coordinates
  const width = 500;
  const height = 150;
  const paddingX = 40;
  const paddingY = 25;

  const weights = sortedHistory.map((h) => h.weight);
  const minW = Math.min(...weights) * 0.9;
  const maxW = Math.max(...weights) * 1.1;
  const diffW = maxW - minW || 1;

  const getCoordinates = () => {
    return sortedHistory.map((item, index) => {
      const x = paddingX + (index / (sortedHistory.length - 1 || 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((item.weight - minW) / diffW) * (height - 2 * paddingY);
      return { x, y, weight: item.weight, date: item.date };
    });
  };

  const points = getCoordinates();
  const pathData = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Gradient area path data
  const areaData = points.length > 0 
    ? `${pathData} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : "";

  return (
    <div className="rounded-3xl border border-slate-200/60 bg-white/90 backdrop-blur-md p-6 shadow-sm">
      <h3 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
        <Scale size={20} className="text-emerald-500" />
        Weight Trend
      </h3>

      {/* SVG Sparkline / Graph */}
      {points.length > 1 && (
        <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50/50 to-white p-2 border border-slate-100">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Line */}
            <line
              x1={paddingX}
              y1={height - paddingY}
              x2={width - paddingX}
              y2={height - paddingY}
              className="stroke-slate-100"
              strokeWidth="2"
            />

            {/* Filled Area */}
            {areaData && <path d={areaData} fill="url(#weightGrad)" />}

            {/* Smooth line */}
            {pathData && (
              <path
                d={pathData}
                fill="none"
                className="stroke-emerald-500"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Dots */}
            {points.map((p, i) => (
              <g key={i} className="group/dot cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  className="fill-emerald-500 stroke-white"
                  strokeWidth="2"
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="10"
                  className="fill-emerald-400 opacity-0 hover:opacity-20 transition-opacity"
                />
                <text
                  x={p.x}
                  y={p.y - 12}
                  textAnchor="middle"
                  className="text-[10px] font-black fill-slate-700 hidden group-hover/dot:block"
                >
                  {p.weight} kg
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* Numerical Log list */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Weight Logs</p>
        {[...sortedHistory].reverse().map((log, idx, arr) => {
          const nextLog = arr[idx + 1];
          const diff = nextLog ? (log.weight - nextLog.weight).toFixed(1) : null;
          const isGain = diff && parseFloat(diff) > 0;
          const isLoss = diff && parseFloat(diff) < 0;

          return (
            <div
              key={idx}
              className="
                flex
                items-center
                justify-between
                rounded-2xl
                bg-slate-50/50
                p-3.5
                border
                border-slate-100
                hover:bg-slate-50
                transition-all
              "
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-2 border border-slate-100 text-slate-500">
                  <Calendar size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{log.weight} kg</p>
                  <p className="text-xs text-slate-400 font-medium">{log.date}</p>
                </div>
              </div>

              {diff && (
                <span
                  className={`
                    text-xs
                    font-black
                    rounded-full
                    px-2.5
                    py-0.5
                    ${
                      isGain
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : isLoss
                        ? "bg-rose-50 text-rose-600 border border-rose-100"
                        : "bg-slate-50 text-slate-500 border border-slate-100"
                    }
                  `}
                >
                  {isGain ? `+${diff}` : diff} kg
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
