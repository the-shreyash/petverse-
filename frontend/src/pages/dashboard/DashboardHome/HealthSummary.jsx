import { HeartPulse, Scale, Syringe, Stethoscope, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useHealth } from "@/hooks/useHealth";

const HealthSummary = () => {
  const { selectedPet, vaccinations, appointments, records, healthScore } = useHealth();

  const petName = selectedPet?.name || "Your pet";
  const overall = healthScore?.overall_score;

  // Vaccination progress from real records
  const totalVax = vaccinations.length;
  const completedVax = vaccinations.filter(
    (v) => (v.status || "").toLowerCase() === "completed"
  ).length;
  const upcomingVax = Math.max(totalVax - completedVax, 0);

  // Last vet visit = most recent past appointment or medical record
  const pastDates = [
    ...appointments.map((a) => a.visitDate),
    ...records.map((r) => r.date)
  ]
    .filter(Boolean)
    .map((d) => new Date(d))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => b - a);
  const lastVisit = pastDates[0]
    ? pastDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

  const weightValue = selectedPet?.weight != null ? `${selectedPet.weight} kg` : "—";

  const healthCards = [
    {
      title: "Overall Health",
      value: overall != null ? `${overall}%` : "—",
      subtitle: overall != null ? (overall >= 80 ? "Excellent" : overall >= 60 ? "Good" : "Needs attention") : "No data yet",
      icon: HeartPulse,
      color: "text-emerald-600 bg-emerald-100"
    },
    {
      title: "Weight",
      value: weightValue,
      subtitle: selectedPet?.species ? `${selectedPet.species} · current` : "Current weight",
      icon: Scale,
      color: "text-cyan-600 bg-cyan-100"
    },
    {
      title: "Vaccination",
      value: totalVax > 0 ? `${completedVax} / ${totalVax}` : "0 / 0",
      subtitle: upcomingVax > 0 ? `${upcomingVax} upcoming` : "Up to date",
      icon: Syringe,
      color: "text-amber-600 bg-amber-100"
    },
    {
      title: "Last Vet Visit",
      value: lastVisit,
      subtitle: pastDates[0] ? "Most recent" : "No visits yet",
      icon: Stethoscope,
      color: "text-rose-600 bg-rose-100"
    }
  ];

  const scorePct = overall != null ? overall : 0;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-600">Health Summary</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">{petName}'s Wellness</h2>
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
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <h3 className="mt-3 text-3xl font-bold text-slate-900">{card.value}</h3>
                  <p className="mt-2 text-sm text-slate-500">{card.subtitle}</p>
                </div>
                <div className={`rounded-2xl p-4 ${card.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overall Progress */}
      <motion.div whileHover={{ y: -4 }} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              <h3 className="text-xl font-semibold text-slate-900">Wellness Progress</h3>
            </div>
            <p className="mt-2 text-slate-500">
              {overall != null
                ? `${petName}'s current health score is ${overall}%, based on nutrition, vaccinations, weight and activity.`
                : `Add health records for ${petName} to generate a wellness score.`}
            </p>
          </div>
          <Activity size={42} className="text-emerald-500" />
        </div>

        <div className="mt-8">
          <div className="mb-2 flex justify-between">
            <span className="text-sm font-medium text-slate-600">Health Score</span>
            <span className="font-semibold text-emerald-600">{overall != null ? `${overall}%` : "—"}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
              style={{ width: `${scorePct}%` }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HealthSummary;
