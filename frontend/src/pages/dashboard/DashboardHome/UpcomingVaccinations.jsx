import { CalendarDays, Syringe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useHealth } from "@/hooks/useHealth";

const statusStyles = {
  upcoming: "bg-amber-100 text-amber-700",
  scheduled: "bg-cyan-100 text-cyan-700",
  completed: "bg-emerald-100 text-emerald-700",
  overdue: "bg-red-100 text-red-700",
};

const UpcomingVaccinations = () => {
  const { vaccinations, selectedPet } = useHealth();

  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const mappedVaccinations = vaccinations.map(v => {
    const due = v.next_due_date || v.dateDue || null;
    const daysLeft = due ? getDaysLeft(due) : 0;
    let status = "scheduled";
    if (due && daysLeft < 0) status = "overdue";
    else if (due && daysLeft < 30) status = "upcoming";
    else status = "completed";

    return {
      id: v.id,
      vaccine: v.name || v.vaccine_name,
      petName: selectedPet?.name || "Unknown Pet",
      dueDate: due || "Not set",
      daysLeft,
      status
    };
  });

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

        {mappedVaccinations.length > 0 ? (
          mappedVaccinations.map((item) => (

            <motion.div
              key={item.id}
              whileHover={{ x: 4 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-100 p-5 transition-all hover:border-emerald-200 gap-4"
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
                className={`rounded-full px-4 py-2 text-sm font-medium self-start sm:self-auto ${statusStyles[item.status]}`}
              >
                {item.status}
              </span>

            </motion.div>

          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-12">
            <Syringe className="text-slate-300 mb-3" size={32} />
            <p className="text-slate-500 font-medium">No upcoming vaccinations</p>
          </div>
        )}

      </div>

    </section>
  );
};

export default UpcomingVaccinations;