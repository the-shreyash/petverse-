import {
  CalendarDays,
  Clock3,
  Hospital,
  Phone,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { appointments } from "@/mock/dashboard";

const UpcomingAppointments = () => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* Header */}

      <div className="mb-8">

        <p className="text-sm font-medium text-emerald-600">
          Vet Appointments
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Upcoming Visits
        </h2>

        <p className="mt-2 text-slate-500">
          Never miss an important health checkup.
        </p>

      </div>

      <div className="space-y-6">

        {appointments.map((appointment) => (

          <motion.div
            key={appointment.id}
            whileHover={{ y: -4 }}
            className="rounded-3xl border border-slate-100 p-6 transition-all hover:border-emerald-200"
          >

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              {/* Left */}

              <div className="flex items-start gap-5">

                <div className="rounded-2xl bg-emerald-100 p-4">
                  <Hospital
                    className="text-emerald-600"
                    size={24}
                  />
                </div>

                <div>

                  <h3 className="text-xl font-semibold text-slate-900">
                    {appointment.pet}
                  </h3>

                  <p className="mt-1 text-slate-500">
                    {appointment.doctor}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-500">

                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {appointment.date}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 size={16} />
                      {appointment.time}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {appointment.clinic}
                    </div>

                  </div>

                </div>

              </div>

              {/* Right */}

              <div className="flex flex-wrap gap-3">

                <button
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    px-5
                    py-3
                    transition
                    hover:border-emerald-300
                  "
                >
                  <Phone size={16} />

                  Contact

                </button>

                <button
                  className="
                    rounded-xl
                    bg-gradient-to-r
                    from-emerald-500
                    to-cyan-500
                    px-6
                    py-3
                    text-white
                    transition
                    hover:shadow-lg
                  "
                >
                  Reschedule
                </button>

              </div>

            </div>

          </motion.div>

        ))}

      </div>

    </section>
  );
};

export default UpcomingAppointments;