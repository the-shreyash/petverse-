import React, { useState } from "react";
import { ShieldAlert, Calendar, Bell, BellOff, Award, FileCheck } from "lucide-react";
import { motion } from "framer-motion";
import HealthStatusBadge from "../shared/HealthStatusBadge";

export default function VaccinationCard({
  vaccination,
  onToggleReminder
}) {
  const {
    name,
    status,
    dateAdministered,
    dateDue,
    reminderStatus = "Active",
    notes
  } = vaccination;

  const [reminder, setReminder] = useState(reminderStatus === "Active");

  const toggle = () => {
    setReminder(!reminder);
    if (onToggleReminder) onToggleReminder(!reminder);
  };

  const getStatusIcon = (st) => {
    if (st === "Completed") return { icon: FileCheck, color: "text-emerald-500 bg-emerald-50" };
    if (st === "Overdue") return { icon: ShieldAlert, color: "text-rose-500 bg-rose-50 animate-bounce" };
    return { icon: Calendar, color: "text-amber-500 bg-amber-50" };
  };

  const statusMeta = getStatusIcon(status);
  const Icon = statusMeta.icon;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Vaccine Name */}
        <div className="flex gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${statusMeta.color}`}>
            <Icon size={20} />
          </div>
          <div>
            <h4 className="text-base font-black text-slate-800 tracking-tight">{name}</h4>
            {notes && (
              <p className="mt-0.5 text-xs text-slate-500 font-semibold">{notes}</p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <HealthStatusBadge status={status} />
      </div>

      {/* Dates Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3.5 rounded-2xl bg-slate-50 p-3.5 border border-slate-100/50">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Administered</span>
          <span className="text-xs font-bold text-slate-700 mt-0.5 block">
            {dateAdministered ? new Date(dateAdministered).toLocaleDateString("en-US", { dateStyle: "medium" }) : "Pending"}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Booster Due</span>
          <span className="text-xs font-bold text-slate-700 mt-0.5 block">
            {dateDue ? new Date(dateDue).toLocaleDateString("en-US", { dateStyle: "medium" }) : "N/A"}
          </span>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        {status === "Completed" ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <Award size={14} />
            <span>Digital Certificate Ready</span>
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-400">
            Next scheduled dose
          </div>
        )}

        {/* Reminder Toggle Button */}
        <button
          onClick={toggle}
          className={`
            flex
            items-center
            gap-1.5
            rounded-lg
            px-2.5
            py-1.5
            text-[11px]
            font-bold
            transition-all
            ${
              reminder
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-slate-50 text-slate-400 border border-slate-100"
            }
          `}
        >
          {reminder ? (
            <>
              <Bell size={13} />
              <span>Reminders On</span>
            </>
          ) : (
            <>
              <BellOff size={13} />
              <span>Reminders Off</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
