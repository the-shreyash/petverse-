import React from "react";
import { Calendar, User, Building, Clock } from "lucide-react";

export default function MedicalInfoGrid({
  visitDate,
  veterinarian,
  clinic,
  followUpDate,
  className = ""
}) {
  const items = [
    {
      label: "Visit Date",
      value: visitDate ? new Date(visitDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }) : "N/A",
      icon: Calendar,
      iconColor: "text-emerald-500 bg-emerald-50"
    },
    {
      label: "Veterinarian",
      value: veterinarian || "Unspecified Vet",
      icon: User,
      iconColor: "text-cyan-500 bg-cyan-50"
    },
    {
      label: "Clinic / Center",
      value: clinic || "Unspecified Clinic",
      icon: Building,
      iconColor: "text-indigo-500 bg-indigo-50"
    },
    {
      label: "Follow-Up Date",
      value: followUpDate ? new Date(followUpDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }) : "None Scheduled",
      icon: Clock,
      iconColor: "text-rose-500 bg-rose-50"
    }
  ];

  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-3.5 rounded-2xl border border-slate-200/50 bg-slate-50/50 p-4 transition duration-200 hover:border-slate-300 hover:bg-slate-50"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconColor}`}>
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
              <h5 className="mt-0.5 truncate text-sm font-bold text-slate-800">{item.value}</h5>
            </div>
          </div>
        );
      })}
    </div>
  );
}
