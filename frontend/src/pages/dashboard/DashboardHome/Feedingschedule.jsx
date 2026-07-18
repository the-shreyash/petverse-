import { Clock3, CheckCircle2, UtensilsCrossed, CalendarPlus } from "lucide-react";
import { motion } from "framer-motion";
import { usePets } from "@/hooks/usePets";
import { Link } from "react-router-dom";

const FeedingSchedule = () => {
  const { selectedPet } = usePets();

  // In a real app, this would fetch from a feeding schedule table
  const feedingSchedule = [];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600">
          Feeding Schedule
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Today's Meals
        </h2>
        <p className="mt-2 text-slate-500">
          Keep track of every meal for {selectedPet?.name || "your pets"}.
        </p>
      </div>

      <div className="space-y-5">
        {feedingSchedule.length > 0 ? (
          feedingSchedule.map((meal) => (
            <motion.div
              whileHover={{ x: 4 }}
              key={meal.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-100 p-5 transition-all hover:border-emerald-200 gap-4"
            >
              <div className="flex items-center gap-5">
                <div className="rounded-2xl bg-emerald-100 p-4 shrink-0">
                  <UtensilsCrossed className="text-emerald-600" size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{meal.meal}</h3>
                  <p className="mt-1 text-sm text-slate-500">{meal.pet}</p>
                </div>
              </div>
              <div className="hidden items-center gap-2 text-slate-600 md:flex">
                <Clock3 size={18} />
                {meal.time}
              </div>
              {meal.completed ? (
                <span className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 self-start sm:self-auto">
                  <CheckCircle2 size={16} /> Completed
                </span>
              ) : (
                <button className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-white transition hover:shadow-lg self-start sm:self-auto">
                  Mark as Fed
                </button>
              )}
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-12 px-4 text-center">
            <UtensilsCrossed className="text-slate-300 mb-4" size={40} />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No meals scheduled</h3>
            <p className="text-slate-500 mb-6 max-w-sm">You haven't set up a feeding schedule yet. Add meal times to keep track of {selectedPet?.name || "your pet"}'s nutrition.</p>
            <Link to="/health/feeding" className="rounded-xl bg-slate-900 px-6 py-2.5 font-medium text-white hover:bg-slate-800 transition flex items-center gap-2">
              <CalendarPlus size={18} /> Add Schedule
            </Link>
          </div>
        )}
      </div>

    </section>
  );
};

export default FeedingSchedule;