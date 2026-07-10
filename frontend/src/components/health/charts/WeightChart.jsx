import React from "react";
import { motion } from "framer-motion";

export default function WeightChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200">
        <p className="text-sm font-semibold text-slate-400">No weight records logged yet.</p>
      </div>
    );
  }

  // Sort chronologically
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Graph dimensions
  const width = 500;
  const height = 200;
  const paddingX = 45;
  const paddingY = 30;

  // Extract min/max values for scaling
  const weights = sortedData.map((d) => d.weight);
  const minW = Math.max(0, Math.min(...weights) - 2);
  const maxW = Math.max(...weights) + 2;

  const pointsCount = sortedData.length;

  // Compute SVG coordinates
  const points = sortedData.map((d, index) => {
    const x = paddingX + (index / Math.max(1, pointsCount - 1)) * (width - paddingX * 2);
    const ratio = (d.weight - minW) / (maxW - minW || 1);
    const y = height - paddingY - ratio * (height - paddingY * 2);
    return { x, y, weight: d.weight, date: d.date };
  });

  // Build SVG Path string (Curved line)
  let linePath = "";
  let areaPath = "";

  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Add a slight bezier curve for smooth aesthetics
      const cpX1 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY1 = points[i - 1].y;
      const cpX2 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY2 = points[i].y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
    }

    // Area path flows down to baseline
    areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  }

  // Draw grid lines (3 horizontal lines)
  const gridLines = [0.25, 0.5, 0.75].map((ratio) => {
    const y = paddingY + ratio * (height - paddingY * 2);
    const value = (maxW - ratio * (maxW - minW)).toFixed(1);
    return { y, value };
  });

  return (
    <div className="w-full overflow-x-auto scrollbar-none">
      <div className="min-w-[450px]">
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
          <defs>
            {/* Area Gradient */}
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
            </linearGradient>

            {/* Line Gradient */}
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

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

          {/* Area under curve */}
          {points.length > 0 && (
            <motion.path
              d={areaPath}
              fill="url(#chartGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          )}

          {/* Curved Line */}
          {points.length > 0 && (
            <motion.path
              d={linePath}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth={3.5}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          )}

          {/* Interactive Dots */}
          {points.map((pt, idx) => (
            <g key={idx}>
              {/* Outer Glow */}
              <motion.circle
                cx={pt.x}
                cy={pt.y}
                r={7}
                fill="#10b981"
                fillOpacity={0.15}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * idx, duration: 0.3 }}
              />

              {/* Point Dot */}
              <motion.circle
                cx={pt.x}
                cy={pt.y}
                r={4}
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth={2.5}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.08 * idx, duration: 0.3 }}
                whileHover={{ scale: 1.5 }}
                className="cursor-pointer"
              />

              {/* Value Label */}
              <motion.text
                x={pt.x}
                y={pt.y - 12}
                fill="#334155"
                fontSize={10}
                fontWeight="black"
                textAnchor="middle"
                initial={{ opacity: 0, y: pt.y - 5 }}
                animate={{ opacity: 1, y: pt.y - 12 }}
                transition={{ delay: 0.2 + 0.05 * idx }}
              >
                {pt.weight}
              </motion.text>

              {/* Date label on X-axis */}
              <text x={pt.x} y={height - 8} fill="#94a3b8" fontSize={9} fontWeight="bold" textAnchor="middle">
                {new Date(pt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
