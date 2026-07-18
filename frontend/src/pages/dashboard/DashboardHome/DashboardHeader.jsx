import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useHealth } from "@/hooks/useHealth";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
};

const DashboardHeader = () => {
  const { user } = useAuth();
  const { vaccinations, appointments, selectedPet } = useHealth();

  const name = user?.first_name || "there";

  // Build a real "daily insight" from the nearest upcoming vaccination or appointment.
  let insight = "You're all caught up. Have a great day with your pets!";
  const now = new Date();
  const dayMs = 86400000;

  const nextVax = vaccinations
    .map((v) => ({ name: v.name || v.vaccine_name, due: (v.next_due_date || v.dateDue) ? new Date(v.next_due_date || v.dateDue) : null }))
    .filter((v) => v.due && !isNaN(v.due.getTime()) && v.due >= now)
    .sort((a, b) => a.due - b.due)[0];

  const nextAppt = appointments
    .filter((a) => ["Scheduled", "Upcoming"].includes(a.status) && a.visitDate && new Date(a.visitDate) >= now)
    .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate))[0];

  if (nextVax) {
    const days = Math.max(0, Math.round((nextVax.due - now) / dayMs));
    insight = `${selectedPet?.name || "Your pet"}'s ${nextVax.name} vaccination is due in ${days} day${days === 1 ? "" : "s"}.`;
  } else if (nextAppt) {
    const days = Math.max(0, Math.round((new Date(nextAppt.visitDate) - now) / dayMs));
    insight = `Upcoming vet visit "${nextAppt.reason}" in ${days} day${days === 1 ? "" : "s"}.`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
    >
      {/* Left */}
      <div>
        <p className="text-sm font-medium text-emerald-600">👋 Welcome Back</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          {greeting()}, {name}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-500">
          Here's a quick overview of your pets, health records, appointments, and AI insights for today.
        </p>
      </div>

      {/* Right */}
      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-500 to-cyan-500 p-5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/20 p-3">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-sm text-white/80">AI Daily Insight</p>
            <h3 className="font-semibold max-w-xs">{insight}</h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
