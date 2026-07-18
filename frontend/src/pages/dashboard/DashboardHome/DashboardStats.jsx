import {
  PawPrint,
  HeartPulse,
  CalendarDays,
  Brain,
} from "lucide-react";

const DashboardStats = ({ data }) => {
  const healthScore = data?.average_health_score ?? 0;
  const stats = [
    {
      title: "Total Pets",
      value: data?.total_pets ?? 0,
      icon: PawPrint,
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      title: "Avg Health Score",
      value: healthScore ? `${Math.round(healthScore)}%` : "—",
      icon: HeartPulse,
      color: "bg-rose-100 text-rose-500",
    },
    {
      title: "Appointments This Week",
      value: data?.appointments_this_week ?? 0,
      icon: CalendarDays,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Vaccinations Due",
      value: data?.vaccinations_due ?? 0,
      icon: Brain,
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {item.value}
                </h2>

              </div>

              <div
                className={`rounded-2xl p-4 ${item.color}`}
              >
                <Icon size={26} />
              </div>

            </div>
          </div>
        );
      })}
    </section>
  );
};

export default DashboardStats;