import React from "react";
import { motion } from "framer-motion";
import { Pill, Activity, Calendar, ShieldCheck, HeartPulse } from "lucide-react";

export default function TreatmentTimeline({ records = [] }) {
  // Filter health records that contain prescriptions, treatments, or surgery diagnostics
  const treatmentRecords = records.filter(
    (r) =>
      r.treatment ||
      (r.prescriptions && r.prescriptions.length > 0) ||
      r.diagnosis.toLowerCase().includes("surgery") ||
      r.diagnosis.toLowerCase().includes("injury")
  );

  if (treatmentRecords.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200">
        <p className="text-sm font-semibold text-slate-400">No medical treatment records found.</p>
      </div>
    );
  }

  // Sort chronologically descending
  const sortedRecords = [...treatmentRecords].sort(
    (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
  );

  return (
    <div className="relative pl-6 border-l-2 border-slate-100 space-y-8 py-3">
      {sortedRecords.map((rec, idx) => {
        const isSurgery = rec.diagnosis.toLowerCase().includes("surgery") || rec.diagnosis.toLowerCase().includes("dental scaling");
        const hasPrescriptions = rec.prescriptions && rec.prescriptions.length > 0;

        return (
          <motion.div
            key={rec.id}
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
                  isSurgery
                    ? "border-rose-500 text-rose-500 group-hover:bg-rose-500 group-hover:text-white"
                    : "border-indigo-500 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white"
                }
              `}
            >
              {isSurgery ? <HeartPulse size={11} /> : <Pill size={11} />}
            </div>

            {/* Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100/50 pb-3">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Calendar size={13} />
                  {new Date(rec.visitDate).toLocaleDateString("en-US", { dateStyle: "long" })}
                </span>
                
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase border ${
                  isSurgery 
                    ? "bg-rose-50 text-rose-700 border-rose-100" 
                    : "bg-indigo-50 text-indigo-700 border-indigo-100"
                }`}>
                  {isSurgery ? "Procedure" : "Medical Treatment"}
                </span>
              </div>

              {/* Diagnostic Summary */}
              <div className="mt-3.5 space-y-1.5">
                <h4 className="text-base font-black text-slate-800 tracking-tight">
                  {rec.diagnosis}
                </h4>
                {rec.treatment && (
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">
                    {rec.treatment}
                  </p>
                )}
              </div>

              {/* Prescriptions summary */}
              {hasPrescriptions && (
                <div className="mt-4 border-t border-slate-100/70 pt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Prescribed Regimen</span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {rec.prescriptions.map((presc, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                        <Pill size={14} className="text-indigo-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-800 truncate">{presc.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold truncate">
                            {presc.dosage} • {presc.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vet Stamp */}
              <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>Authorized: {rec.veterinarian}</span>
                <span>{rec.clinic}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
