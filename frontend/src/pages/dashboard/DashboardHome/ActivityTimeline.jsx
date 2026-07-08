import {
  Bot,
  CalendarDays,
  Clock3,
  Syringe,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "framer-motion";
import { activityTimeline } from "@/mock/dashboard";

const iconMap = {
  feeding: UtensilsCrossed,
  ai: Bot,
  vaccine: Syringe,
  appointment: CalendarDays,
};

const colorMap = {
  feeding: "bg-emerald-100 text-emerald-600",
  ai: "bg-cyan-100 text-cyan-600",
  vaccine: "bg-amber-100 text-amber-600",
  appointment: "bg-violet-100 text-violet-600",
};

const ActivityTimeline = () => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* Header */}

      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600">
          Recent Activity
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Activity Timeline
        </h2>

        <p className="mt-2 text-slate-500">
          Everything happening across your pets in one place.
        </p>
      </div>

      <div className="relative ml-5 border-l-2 border-slate-200">

        {activityTimeline.map((activity) => {
          const Icon = iconMap[activity.type];

          return (
            <motion.div
              key={activity.id}
              whileHover={{ x: 6 }}
              className="relative mb-8 pl-8"
            >
              {/* Timeline Dot */}

              <div
                className={`absolute -left-5 flex h-10 w-10 items-center justify-center rounded-full ${colorMap[activity.type]}`}
              >
                <Icon size={18} />
              </div>

              <div className="rounded-2xl border border-slate-100 p-5 transition hover:border-emerald-200">

                <div className="flex items-center justify-between">

                  <h3 className="font-semibold text-slate-900">
                    {activity.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock3 size={15} />
                    {activity.time}
                  </div>

                </div>

                <p className="mt-2 text-slate-500">
                  {activity.description}
                </p>

              </div>

            </motion.div>
          );
        })}

      </div>

    </section>
  );
};

export default ActivityTimeline;