import React from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Scale,
  ShieldCheck,
  Pill,
  CalendarDays,
  Sparkles,
  ChevronRight,
  TrendingUp,
  User,
  HeartPulse
} from "lucide-react";

export default function MedicalTimeline({ records = [], appointments = [], petName = "Luna" }) {
  // Compile all clinical events into a unified timeline
  const compileTimelineEvents = () => {
    const events = [];

    // 1. Vet Visits (Health Records)
    records.forEach((rec) => {
      events.push({
        id: `visit-${rec.id}`,
        date: rec.visitDate,
        category: "Vet Visit",
        title: rec.diagnosis || "General Vet Consult",
        subtitle: `Assessed by ${rec.veterinarian} • ${rec.clinic}`,
        notes: rec.treatment || rec.notes,
        icon: Stethoscope,
        color: "bg-emerald-50 text-emerald-600 border-emerald-200",
        original: rec
      });

      // 2. Weight Updated (if present on record)
      if (rec.weight > 0) {
        events.push({
          id: `weight-${rec.id}`,
          date: rec.visitDate,
          category: "Weight Updated",
          title: `Weight logged at ${rec.weight} kg`,
          subtitle: `Recorded during checkup at ${rec.clinic}`,
          notes: "",
          icon: Scale,
          color: "bg-cyan-50 text-cyan-600 border-cyan-200"
        });
      }

      // 3. Vaccinations administered
      if (rec.vaccinations && rec.vaccinations.length > 0) {
        rec.vaccinations.forEach((vax, idx) => {
          events.push({
            id: `vax-${rec.id}-${idx}`,
            date: vax.dateAdministered || rec.visitDate,
            category: "Vaccination",
            title: `${vax.name} Vaccine Administered`,
            subtitle: `Booster due on: ${vax.dateDue}`,
            notes: vax.notes,
            icon: ShieldCheck,
            color: "bg-teal-50 text-teal-600 border-teal-200"
          });
        });
      }

      // 4. Prescriptions
      if (rec.prescriptions && rec.prescriptions.length > 0) {
        rec.prescriptions.forEach((presc, idx) => {
          events.push({
            id: `presc-${rec.id}-${idx}`,
            date: rec.visitDate,
            category: "Prescription Added",
            title: `Prescribed: ${presc.name}`,
            subtitle: `Dosage: ${presc.dosage} • Frequency: ${presc.frequency}`,
            notes: `Duration: ${presc.duration}`,
            icon: Pill,
            color: "bg-indigo-50 text-indigo-600 border-indigo-200"
          });
        });
      }
    });

    // 5. Scheduled Appointments
    appointments.forEach((apt) => {
      events.push({
        id: `apt-${apt.id}`,
        date: apt.visitDate,
        category: "Appointment Scheduled",
        title: `Upcoming: ${apt.reason}`,
        subtitle: `With ${apt.veterinarian} at ${apt.clinic}`,
        notes: `Time: ${apt.time}. Instructions: ${apt.notes || "None"}`,
        icon: CalendarDays,
        color: "bg-amber-50 text-amber-600 border-amber-200"
      });
    });

    // 6. Add simulated AI Insights based on score or species
    if (records.length > 0) {
      const sortedByDate = [...records].sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
      const latestRecord = sortedByDate[0];
      const isSubOptimal = latestRecord.healthScore < 85;

      events.push({
        id: `ai-insight-${latestRecord.id}`,
        date: latestRecord.visitDate,
        category: "AI Recommendation",
        title: `AI VetCare Diagnostic Insight`,
        subtitle: "Generated via VetCare Analysis Model",
        notes: isSubOptimal
          ? `Based on ${petName}'s recent checkup score (${latestRecord.healthScore}%), we advise completing pending booster shots and monitoring their dental status.`
          : `Excellent! ${petName}'s vitals, weight curve, and checkup compliance rate are at optimal values (health index ${latestRecord.healthScore}%).`,
        icon: Sparkles,
        color: "bg-gradient-to-r from-emerald-50 to-cyan-50 text-emerald-600 border-emerald-100 shadow-sm"
      });
    }

    // Sort chronologically (latest first)
    return events.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const timelineEvents = compileTimelineEvents();

  if (timelineEvents.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200">
        <p className="text-sm font-semibold text-slate-400">No events in the medical timeline yet.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l-2 border-slate-100 space-y-8 py-3">
      {timelineEvents.map((evt, idx) => {
        const Icon = evt.icon;
        const eventDate = new Date(evt.date);
        const formattedDate = eventDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });

        const isFuture = eventDate > new Date();

        return (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.5) }}
            className="relative group"
          >
            {/* Timeline dot */}
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
                border-2
                bg-white
                shadow-sm
                transition-all
                duration-300
                group-hover:scale-110
                ${evt.color}
              `}
            >
              <Icon size={11} />
            </div>

            {/* Event Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {evt.category}
                </span>
                
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isFuture ? "bg-cyan-50 text-cyan-700" : "bg-slate-100 text-slate-500"
                }`}>
                  {formattedDate} {isFuture && "• Scheduled"}
                </span>
              </div>

              <div className="mt-3">
                <h4 className="text-base font-black text-slate-800 tracking-tight leading-tight">
                  {evt.title}
                </h4>
                <p className="mt-0.5 text-xs text-slate-500 font-semibold">
                  {evt.subtitle}
                </p>
                
                {evt.notes && (
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                    {evt.notes}
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
