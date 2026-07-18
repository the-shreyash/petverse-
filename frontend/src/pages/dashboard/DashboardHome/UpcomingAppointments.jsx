import { Calendar, Clock, Stethoscope, CalendarPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { useHealth } from "@/hooks/useHealth";

const typeStyles = {
  Clinic: "bg-emerald-100 text-emerald-700",
  "Video Call": "bg-indigo-100 text-indigo-700",
};

const UpcomingAppointments = () => {
  const { appointments, loading } = useHealth();

  // Only future, non-cancelled appointments, soonest first.
  const upcoming = [...appointments]
    .filter((a) => ["Scheduled", "Upcoming"].includes(a.status))
    .filter((a) => a.visitDate && new Date(a.visitDate) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate))
    .slice(0, 3);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Veterinary Care
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Upcoming Appointments
          </h2>
        </div>
        <Link
          to="/health/appointments"
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-600 transition hover:bg-slate-50 self-start sm:self-auto"
        >
          View Calendar
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-8 text-center text-slate-500">Loading appointments...</div>
        ) : upcoming.length > 0 ? (
          upcoming.map((appt) => (
            <motion.div
              whileHover={{ y: -4 }}
              key={appt.id}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all hover:border-emerald-200 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{appt.reason || "Vet Appointment"}</h3>
                  <p className="mt-1 text-sm text-slate-500">{appt.clinic || appt.veterinarian || "Checkup"}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${typeStyles['Clinic']}`}>
                  <Stethoscope size={20} />
                </div>
              </div>

              <div className="mb-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  {appt.visitDate ? new Date(appt.visitDate).toLocaleDateString() : "—"}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-400" />
                  {appt.time || (appt.visitDate ? new Date(appt.visitDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—")}
                </div>
              </div>

              <Link
                to="/health/appointments"
                className="block w-full rounded-xl bg-white border border-slate-200 py-2.5 text-center font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Manage
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-12 px-4 text-center bg-slate-50/50">
            <Stethoscope className="text-slate-300 mb-4" size={40} />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No upcoming appointments</h3>
            <p className="text-slate-500 mb-6 max-w-sm">Keep your pet healthy by scheduling regular checkups. Your upcoming vet visits will appear here.</p>
            <Link to="/health/appointments" className="rounded-xl bg-slate-900 px-6 py-2.5 font-medium text-white hover:bg-slate-800 transition flex items-center gap-2">
              <CalendarPlus size={18} /> Book Appointment
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingAppointments;