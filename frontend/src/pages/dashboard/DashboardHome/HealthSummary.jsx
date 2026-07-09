import {
  Activity,
  HeartPulse,
  Scale,
  Syringe,
  Stethoscope,
  TrendingUp,
} from "lucide-react";

import { motion } from "framer-motion";

const healthCards = [
  {
    title: "Overall Health",
    value: "96%",
    subtitle: "Excellent",
    icon: HeartPulse,
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    title: "Weight",
    value: "28.4 kg",
    subtitle: "+0.4 kg this month",
    icon: Scale,
    color: "text-cyan-600 bg-cyan-100",
  },
  {
    title: "Vaccination",
    value: "8 / 10",
    subtitle: "2 Upcoming",
    icon: Syringe,
    color: "text-amber-600 bg-amber-100",
  },
  {
    title: "Last Vet Visit",
    value: "12 Jun",
    subtitle: "Routine Checkup",
    icon: Stethoscope,
    color: "text-rose-600 bg-rose-100",
  },
];

const HealthSummary = () => {
  return (
    <section className="space-y-6">

      <div>
        <p className="text-sm font-medium text-emerald-600">
          Health Summary
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Your Pet's Wellness
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {healthCards.map((card) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <h3 className="mt-3 text-3xl font-bold text-slate-900">
                    {card.value}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {card.subtitle}
                  </p>

                </div>

                <div
                  className={`rounded-2xl p-4 ${card.color}`}
                >
                  <Icon size={24} />
                </div>

              </div>

            </motion.div>
          );
        })}

      </div>

      {/* Overall Progress */}

      <motion.div
        whileHover={{ y: -4 }}
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="flex items-center justify-between">

          <div>

            <div className="flex items-center gap-2">

              <TrendingUp
                size={18}
                className="text-emerald-500"
              />

              <h3 className="text-xl font-semibold text-slate-900">
                Wellness Progress
              </h3>

            </div>

            <p className="mt-2 text-slate-500">
              Luna has maintained excellent health over the last 30 days.
            </p>

          </div>

          <Activity
            size={42}
            className="text-emerald-500"
          />

        </div>

        <div className="mt-8">

          <div className="mb-2 flex justify-between">

            <span className="text-sm font-medium text-slate-600">
              Health Score
            </span>

            <span className="font-semibold text-emerald-600">
              96%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">

            <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />

          </div>

        </div>

      </motion.div>

    </section>
  );
};

export default HealthSummary;