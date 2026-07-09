import React from "react";
import { Stethoscope, Calendar, User, FileText } from "lucide-react";

export default function MedicalTimeline({ medicalHistory = [] }) {
  if (!medicalHistory || medicalHistory.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center bg-white/50">
        <Stethoscope className="mx-auto text-slate-300 mb-3" size={32} />
        <p className="text-slate-400 font-medium">No medical records logged.</p>
      </div>
    );
  }

  const getTypeStyles = (type) => {
    switch (type) {
      case "Surgery":
        return "bg-rose-50 border-rose-100 text-rose-700";
      case "Treatment":
        return "bg-amber-50 border-amber-100 text-amber-700";
      default:
        return "bg-emerald-50 border-emerald-100 text-emerald-700";
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/60 bg-white/90 backdrop-blur-md p-6 shadow-sm">
      <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
        <Stethoscope size={20} className="text-emerald-500" />
        Medical History
      </h3>

      <div className="relative border-l border-slate-100 ml-4 pl-6 space-y-6">
        {medicalHistory.map((record) => (
          <div key={record.id} className="relative group">
            {/* Dot indicator */}
            <span className="absolute -left-[33px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-4 ring-slate-50 border border-slate-200">
              <span className={`h-1.5 w-1.5 rounded-full ${record.type === "Surgery" ? "bg-rose-500" : record.type === "Treatment" ? "bg-amber-500" : "bg-emerald-500"}`} />
            </span>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  {record.diagnosis || "General Consult"}
                  <span className={`inline-flex items-center border rounded-full px-2 py-0.5 text-[10px] font-bold ${getTypeStyles(record.type)}`}>
                    {record.type}
                  </span>
                </h4>
                <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                  <Calendar size={12} />
                  <span>{record.date}</span>
                </div>
              </div>

              {record.notes && (
                <p className="text-sm text-slate-500 font-medium leading-relaxed bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
                  {record.notes}
                </p>
              )}

              {record.vet && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                  <User size={12} />
                  <span>Veterinarian: <span className="font-semibold text-slate-600">{record.vet}</span></span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
