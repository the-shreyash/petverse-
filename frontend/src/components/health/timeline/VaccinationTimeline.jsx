import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Calendar, Info } from "lucide-react";
import HealthStatusBadge from "../shared/HealthStatusBadge";

export default function VaccinationTimeline({ vaccinations = [] }) {
  if (vaccinations.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200">
        <p className="text-sm font-semibold text-slate-400">No vaccination schedule found.</p>
      </div>
    );
  }

  // Sort vaccinations chronologically by administer date or due date
  const sortedVax = [...vaccinations].sort((a, b) => {
    const dateA = new Date(a.dateAdministered || a.dateDue);
    const dateB = new Date(b.dateAdministered || b.dateDue);
    return dateB - dateA;
  });

  return (
    <div className="relative pl-6 border-l-2 border-slate-100 space-y-8 py-3">
      {sortedVax.map((vax, idx) => {
        const isCompleted = vax.status === "Completed";
        const vaxDate = isCompleted ? vax.dateAdministered : vax.dateDue;

        return (
          <motion.div
            key={vax.id || idx}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className="relative group"
          >
            {/* Dot */}
            <div
              className={`
                absolute
                -left-[35px]
                top-1.5
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-white
                border-2
                shadow-sm
                transition
                ${
                  isCompleted
                    ? "border-emerald-500 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white"
                    : "border-amber-500 text-amber-500 group-hover:bg-amber-500 group-hover:text-white"
                }
              `}
            >
              {isCompleted ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />}
            </div>

            {/* Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100/50 pb-3">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Calendar size={13} />
                  {isCompleted ? "Administered: " : "Next Due: "}
                  {vaxDate ? new Date(vaxDate).toLocaleDateString("en-US", { dateStyle: "long" }) : "N/A"}
                </span>

                <HealthStatusBadge status={vax.status} />
              </div>

              <div className="mt-3.5 space-y-1">
                <h4 className="text-base font-black text-slate-800 tracking-tight">{vax.name}</h4>
                {vax.notes && (
                  <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Info size={11} className="text-slate-400" />
                    <span>{vax.notes}</span>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
