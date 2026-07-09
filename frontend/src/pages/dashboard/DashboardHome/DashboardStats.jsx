import {
  PawPrint,
  HeartPulse,
  CalendarDays,
  Brain,
} from "lucide-react";

const stats = [
  {
    title: "Total Pets",
    value: "3",
    icon: PawPrint,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "Health Score",
    value: "96%",
    icon: HeartPulse,
    color: "bg-rose-100 text-rose-500",
  },
  {
    title: "Appointments",
    value: "2",
    icon: CalendarDays,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "AI Insights",
    value: "5",
    icon: Brain,
    color: "bg-emerald-100 text-emerald-600",
  },
];

const DashboardStats = () => {
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