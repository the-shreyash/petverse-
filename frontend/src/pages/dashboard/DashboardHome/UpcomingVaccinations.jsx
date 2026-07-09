import { CalendarDays, Syringe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { vaccinations } from "@/mock/dashboard";

const statusStyles = {
  upcoming: "bg-amber-100 text-amber-700",
  scheduled: "bg-cyan-100 text-cyan-700",
  completed: "bg-emerald-100 text-emerald-700",
  overdue: "bg-red-100 text-red-700",
};

const UpcomingVaccinations = () => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-emerald-600">
            Vaccinations
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Upcoming Vaccinations
          </h2>
        </div>

        <Link
          to="/health/vaccinations"
          className="flex items-center gap-2 font-medium text-emerald-600 hover:text-emerald-700"
        >
          View All

          <ArrowRight size={18} />
        </Link>

      </div>

      <div className="space-y-5">

        {vaccinations.map((item) => (

          <motion.div
            key={item.id}
            whileHover={{ x: 4 }}
            className="flex items-center justify-between rounded-2xl border border-slate-100 p-5 transition-all hover:border-emerald-200"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-2xl bg-emerald-100 p-4">
                <Syringe
                  className="text-emerald-600"
                  size={22}
                />
              </div>

              <div>

                <h3 className="font-semibold text-slate-900">
                  {item.vaccine}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {item.petName}
                </p>

              </div>

            </div>

            <div className="hidden text-center md:block">

              <p className="text-sm text-slate-500">
                Due Date
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {item.dueDate}
              </p>

            </div>

            <div className="hidden text-center lg:block">

              <p className="text-sm text-slate-500">
                Remaining
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {item.daysLeft} days
              </p>

            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-medium ${statusStyles[item.status]}`}
            >
              {item.status}
            </span>

            <button
              className="
                rounded-xl
                bg-gradient-to-r
                from-emerald-500
                to-cyan-500
                px-5
                py-2.5
                text-white
                transition
                hover:shadow-lg
              "
            >
              Book
            </button>

          </motion.div>

        ))}

      </div>

    </section>
  );
};

export default UpcomingVaccinations;