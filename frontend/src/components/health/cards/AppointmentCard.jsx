import React from "react";
import { Calendar, Clock, MapPin, Stethoscope, User, CalendarDays, X } from "lucide-react";
import { motion } from "framer-motion";
import HealthStatusBadge from "../shared/HealthStatusBadge";

export default function AppointmentCard({
  appointment,
  onCancel,
  onReschedule
}) {
  const {
    id,
    visitDate,
    time,
    reason,
    status = "Scheduled",
    veterinarian,
    clinic,
    notes
  } = appointment;

  const isUpcoming = ["Upcoming", "Scheduled"].includes(status);
  const clinicLabel = typeof clinic === "string" ? clinic : clinic?.name || "";

  const formattedDate = visitDate
    ? new Date(visitDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : "Unscheduled";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500 shadow-inner">
            <CalendarDays size={20} />
          </div>
          <div>
            <h4 className="text-base font-black text-slate-800 tracking-tight">{reason}</h4>
            <p className="mt-0.5 text-xs text-slate-400 font-semibold">{clinicLabel}</p>
          </div>
        </div>

        <HealthStatusBadge status={status} />
      </div>

      {/* Date & Time Slot */}
      <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100/50">
        <div className="flex items-center gap-2.5">
          <Calendar size={16} className="text-emerald-500" />
          <span className="text-sm font-bold text-slate-700">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Clock size={16} className="text-cyan-500" />
          <span className="text-sm font-bold text-slate-700">{time || "—"}</span>
        </div>
      </div>

      {/* Practitioner details */}
      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
        <User size={14} className="text-slate-400" />
        <span>Assigned Specialist:</span>
        <span className="font-extrabold text-slate-700">{veterinarian}</span>
      </div>

      {/* Instructions */}
      {notes && (
        <div className="mt-3.5 rounded-xl bg-amber-50/40 p-3 text-xs font-semibold text-amber-800 border border-amber-100/50">
          <span className="block font-black uppercase text-[9px] tracking-wider text-amber-600 mb-1">Pre-Checkup Instructions:</span>
          {notes}
        </div>
      )}

      {/* Action Buttons */}
      {isUpcoming && (
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3.5">
          <button
            onClick={() => onCancel && onCancel(id)}
            className="
              flex
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-xl
              border
              border-slate-200
              py-2.5
              text-xs
              font-bold
              text-slate-500
              transition
              hover:bg-rose-50
              hover:text-rose-600
              hover:border-rose-200
            "
          >
            <X size={13} />
            <span>Cancel</span>
          </button>
          <button
            onClick={() => onReschedule && onReschedule(id)}
            className="
              flex
              flex-[2]
              items-center
              justify-center
              gap-1.5
              rounded-xl
              bg-slate-900
              py-2.5
              text-xs
              font-bold
              text-white
              transition
              hover:bg-slate-800
            "
          >
            <CalendarDays size={13} />
            <span>Reschedule Checkup</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
