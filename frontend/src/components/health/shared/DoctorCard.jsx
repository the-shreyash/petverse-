import React from "react";
import { Phone, Mail, Award, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function DoctorCard({
  name,
  clinic = "Oakwood Veterinary Hospital",
  specialty = "General Veterinary Medicine",
  phone = "+1 (555) 019-2831",
  email = "appointments@oakwoodvet.com",
  image = "",
  className = ""
}) {
  // Simple check or default avatar initials
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "VET";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        ${className}
      `}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Avatar */}
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-16 w-16 rounded-2xl object-cover shadow-inner"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-lg font-black text-white shadow-md">
            {initials}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-lg font-black text-slate-800 truncate">{name || "Dr. Alex Carter"}</h4>
            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{specialty}</p>
          <p className="text-sm font-semibold text-slate-500 mt-1">{clinic}</p>
        </div>
      </div>

      {/* Specialty Badge / Certifications */}
      <div className="mt-5 flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-xs font-semibold text-slate-600">
        <Award size={15} className="text-cyan-500" />
        <span>DVM, Licensed Veterinary Practitioner</span>
      </div>

      {/* Actions */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <a
          href={`tel:${phone}`}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            py-2.5
            text-xs
            font-bold
            text-slate-700
            transition
            hover:bg-slate-50
            hover:border-slate-300
          "
        >
          <Phone size={14} className="text-slate-400" />
          <span>Call Doctor</span>
        </a>
        <a
          href={`mailto:${email}`}
          className="
            flex
            items-center
            justify-center
            gap-2
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
          <Mail size={14} />
          <span>Email Vet</span>
        </a>
      </div>
    </motion.div>
  );
}
