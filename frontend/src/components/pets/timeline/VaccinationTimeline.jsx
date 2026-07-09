import React from "react";
import { Syringe, Calendar, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export default function VaccinationTimeline({ vaccinations = [] }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="text-emerald-500" size={16} />;
      case "Overdue":
        return <AlertTriangle className="text-rose-500 animate-pulse" size={16} />;
      default:
        return <Clock className="text-amber-500" size={16} />;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Overdue":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  if (!vaccinations || vaccinations.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center bg-white/50">
        <Syringe className="mx-auto text-slate-300 mb-3" size={32} />
        <p className="text-slate-400 font-medium">No vaccination records logged.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200/60 bg-white/90 backdrop-blur-md p-6 shadow-sm">
      <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
        <Syringe size={20} className="text-emerald-500" />
        Vaccination History
      </h3>

      <div className="relative border-l border-slate-100 ml-4 pl-6 space-y-6">
        {vaccinations.map((vac) => (
          <div key={vac.id} className="relative group">
            {/* Timeline Indicator dot */}
            <span className="absolute -left-[33px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-4 ring-slate-50 border border-slate-200">
              <span className={`h-1.5 w-1.5 rounded-full ${vac.status === "Completed" ? "bg-emerald-500" : vac.status === "Overdue" ? "bg-rose-500" : "bg-amber-500"}`} />
            </span>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  {vac.name}
                  <span className={`inline-flex items-center gap-1 border rounded-full px-2 py-0.5 text-[10px] font-bold ${getStatusStyles(vac.status)}`}>
                    {getStatusIcon(vac.status)}
                    <span>{vac.status}</span>
                  </span>
                </h4>
                {vac.notes && <p className="mt-1 text-sm text-slate-500 font-medium">{vac.notes}</p>}
              </div>

              <div className="text-left sm:text-right shrink-0 mt-1 sm:mt-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <Calendar size={12} />
                  <span>Administered</span>
                </div>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{vac.dateAdministered || "N/A"}</p>
                {vac.dateDue && (
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Next due: <span className="font-semibold text-slate-600">{vac.dateDue}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
