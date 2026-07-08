import { Clock3, CheckCircle2, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { feedingSchedule } from "@/mock/dashboard";

const FeedingSchedule = () => {
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
          Keep track of every meal for your pets.
        </p>

      </div>

      <div className="space-y-5">

        {feedingSchedule.map((meal) => (

          <motion.div
            whileHover={{ x: 4 }}
            key={meal.id}
            className="flex items-center justify-between rounded-2xl border border-slate-100 p-5 transition-all hover:border-emerald-200"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-2xl bg-emerald-100 p-4">

                <UtensilsCrossed
                  className="text-emerald-600"
                  size={22}
                />

              </div>

              <div>

                <h3 className="font-semibold text-slate-900">
                  {meal.meal}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {meal.pet}
                </p>

              </div>

            </div>

            <div className="hidden items-center gap-2 text-slate-600 md:flex">

              <Clock3 size={18} />

              {meal.time}

            </div>

            {meal.completed ? (
              <span className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">

                <CheckCircle2 size={16} />

                Completed

              </span>
            ) : (
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
                Mark as Fed
              </button>
            )}

          </motion.div>

        ))}

      </div>

    </section>
  );
};

export default FeedingSchedule;