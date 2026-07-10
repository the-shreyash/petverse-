import React from "react";
import { motion } from "framer-motion";

export default function GrowthChart({ data = [], breed = "Golden Retriever" }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200">
        <p className="text-sm font-semibold text-slate-400">No logs available to render growth curves.</p>
      </div>
    );
  }

  // Generate Breed-Specific Growth Reference Curve
  // Standard golden: monthly progression: 24, 25.5, 27, 28, 29
  // Standard persian: 4.2, 4.5, 4.8, 5.0, 5.2
  // Standard shepherd: 31, 33, 34.5, 36, 37.5
  const getBreedReferenceCurve = (brd) => {
    const b = brd.toLowerCase();
    if (b.includes("persian")) {
      return [3.8, 4.2, 4.5, 4.9, 5.2];
    }
    if (b.includes("german")) {
      return [32.0, 33.5, 35.0, 36.2, 37.5];
    }
    // Default Golden Retriever values
    return [24.5, 26.0, 27.2, 28.0, 29.0];
  };

  const refWeights = getBreedReferenceCurve(breed);

  // Chronologically sort actual data
  const sortedActual = [...data]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-5); // Align at most 5 latest points

  const actualWeights = sortedActual.map((d) => d.weight);

  // Map charts axes
  const width = 500;
  const height = 220;
  const paddingX = 45;
  const paddingY = 30;

  // Compute Scales
  const allWeights = [...actualWeights, ...refWeights];
  const minW = Math.max(0, Math.min(...allWeights) - 2);
  const maxW = Math.max(...allWeights) + 2;

  const pointsCount = Math.max(actualWeights.length, refWeights.length);

  // Coordinate mapper helper
  const getCoordinates = (weightsList) => {
    return weightsList.map((w, index) => {
      const x = paddingX + (index / Math.max(1, weightsList.length - 1)) * (width - paddingX * 2);
      const ratio = (w - minW) / (maxW - minW || 1);
      const y = height - paddingY - ratio * (height - paddingY * 2);
      return { x, y, weight: w };
    });
  };

  const refPoints = getCoordinates(refWeights);
  const actualPoints = getCoordinates(actualWeights);

  // Build curved path functions
  const getCurvePath = (pts) => {
    if (pts.length === 0) return "";
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cpX = pts[i - 1].x + (pts[i].x - pts[i - 1].x) / 2;
      path += ` C ${cpX} ${pts[i - 1].y}, ${cpX} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
    }
    return path;
  };

  const refPath = getCurvePath(refPoints);
  const actualPath = getCurvePath(actualPoints);

  const gridLines = [0.25, 0.5, 0.75].map((ratio) => {
    const y = paddingY + ratio * (height - paddingY * 2);
    const value = (maxW - ratio * (maxW - minW)).toFixed(1);
    return { y, value };
  });

  return (
    <div className="w-full overflow-x-auto scrollbar-none">
      <div className="min-w-[450px] space-y-4">
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold justify-end px-4">
          <div className="flex items-center gap-1.5 text-slate-500">
            <div className="h-0.5 w-6 border-t-2 border-dashed border-slate-400" />
            <span>Breed Standard Median</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600">
            <div className="h-0.5 w-6 bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <span>Actual Growth Curve</span>
          </div>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
          {/* Grid lines */}
          {gridLines.map((line, idx) => (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={line.y}
                x2={width - paddingX}
                y2={line.y}
                stroke="#e2e8f0"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text x={paddingX - 8} y={line.y + 4} fill="#94a3b8" fontSize={9} fontWeight="bold" textAnchor="end">
                {line.value}kg
              </text>
            </g>
          ))}

          {/* Reference Breed Path */}
          {refPoints.length > 0 && (
            <motion.path
              d={refPath}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth={2}
              strokeDasharray="5 5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
          )}

          {/* Actual Pet Growth Path */}
          {actualPoints.length > 0 && (
            <motion.path
              d={actualPath}
              fill="none"
              stroke="url(#growthGradient)"
              strokeWidth={3.5}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
          )}

          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Standard points label */}
          {refPoints.map((pt, idx) => (
            <circle key={`ref-${idx}`} cx={pt.x} cy={pt.y} r={3} fill="#94a3b8" />
          ))}

          {/* Actual points dots */}
          {actualPoints.map((pt, idx) => (
            <g key={`act-${idx}`}>
              <circle cx={pt.x} cy={pt.y} r={6} fill="#10b981" fillOpacity={0.1} />
              <circle cx={pt.x} cy={pt.y} r={3.5} fill="#ffffff" stroke="#10b981" strokeWidth={2} />
              <text x={pt.x} y={pt.y - 12} fill="#0f172a" fontSize={9} fontWeight="black" textAnchor="middle">
                {pt.weight}
              </text>
              {/* Date Labels */}
              <text x={pt.x} y={height - 8} fill="#94a3b8" fontSize={9} fontWeight="bold" textAnchor="middle">
                {sortedActual[idx] ? new Date(sortedActual[idx].date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
