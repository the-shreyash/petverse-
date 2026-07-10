import React from "react";
import { Stethoscope, FileText, ChevronRight, AlertCircle, Calendar, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import MedicalInfoGrid from "../shared/MedicalInfoGrid";
import HealthStatusBadge from "../shared/HealthStatusBadge";

export default function MedicalRecordCard({
  record,
  onDelete,
  onSelectDocument
}) {
  const {
    id,
    visitDate,
    veterinarian,
    clinic,
    healthScore,
    weight,
    temperature,
    heartRate,
    diagnosis,
    treatment,
    prescriptions = [],
    vaccinations = [],
    attachments = [],
    notes,
    followUpDate
  } = record;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all"
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 shadow-inner">
            <Stethoscope size={22} />
          </div>
          <div>
            <h4 className="text-xl font-black text-slate-800 tracking-tight">
              {diagnosis || "General Consult"}
            </h4>
            <div className="mt-0.5 flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Calendar size={12} />
              <span>{new Date(visitDate).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {healthScore && (
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
              Score: {healthScore}%
            </span>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="rounded-full p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
              title="Delete Record"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Vitals Quick Read */}
      <div className="mt-5 grid grid-cols-3 gap-4 border-b border-slate-100 pb-5 text-center">
        <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-100/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Weight</span>
          <span className="text-base font-black text-slate-800 mt-1 block">{weight ? `${weight} kg` : "--"}</span>
        </div>
        <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-100/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Temperature</span>
          <span className="text-base font-black text-slate-800 mt-1 block">{temperature ? `${temperature} °C` : "--"}</span>
        </div>
        <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-100/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Heart Rate</span>
          <span className="text-base font-black text-slate-800 mt-1 block">{heartRate ? `${heartRate} bpm` : "--"}</span>
        </div>
      </div>

      {/* Clinic/Vet metadata grid */}
      <div className="mt-5">
        <MedicalInfoGrid
          visitDate={visitDate}
          veterinarian={veterinarian}
          clinic={clinic}
          followUpDate={followUpDate}
        />
      </div>

      {/* Treatment & Notes */}
      <div className="mt-5 space-y-4">
        {treatment && (
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Treatment Performed</h5>
            <p className="text-sm font-semibold text-slate-600 leading-relaxed bg-slate-50/30 p-3 rounded-2xl border border-slate-100/50">
              {treatment}
            </p>
          </div>
        )}

        {notes && (
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinical Notes</h5>
            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
              "{notes}"
            </p>
          </div>
        )}
      </div>

      {/* Prescriptions & Administered Vaccines */}
      {(prescriptions.length > 0 || vaccinations.length > 0) && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {prescriptions.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-4">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Prescriptions</h5>
              <div className="space-y-2">
                {prescriptions.map((p, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5 rounded-xl bg-white p-2.5 shadow-sm border border-slate-100">
                    <span className="text-sm font-bold text-slate-800">{p.name}</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {p.dosage} • {p.frequency} ({p.duration})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {vaccinations.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-4">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Administered Vaccines</h5>
              <div className="space-y-2">
                {vaccinations.map((v, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 rounded-xl bg-white p-2.5 shadow-sm border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{v.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Next due: {v.dateDue}</span>
                    </div>
                    <HealthStatusBadge status="Completed" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Attached Documentation</h5>
          <div className="flex flex-wrap gap-2.5">
            {attachments.map((file) => (
              <button
                key={file.id}
                onClick={() => onSelectDocument && onSelectDocument(file)}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-slate-700
                  transition
                  hover:bg-slate-50
                  hover:border-slate-300
                "
              >
                <FileText size={14} className="text-emerald-500" />
                <span className="truncate max-w-[150px]">{file.name}</span>
                <ChevronRight size={12} className="text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
