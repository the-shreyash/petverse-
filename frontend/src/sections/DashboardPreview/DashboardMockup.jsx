import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Brain,
  User,
  Calendar,
  ShoppingBag,
  Activity,
  Heart,
  Sparkles,
  Bell,
  Search,
} from "lucide-react";
import GlassCard from "../../components/ui/GlassCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const PET_DATA = {
  luna: {
    name: "Luna",
    breed: "Golden Retriever",
    age: "2 y/o",
    avatar: "🦮",
    healthScore: 98,
    healthStatus: "Optimal Condition",
    metrics: [
      { label: "Heart Rate", value: "72 bpm", color: "text-rose-500" },
      { label: "Active Calories", value: "480 kcal", color: "text-orange-500" },
      { label: "Sleep Quality", value: "92%", color: "text-indigo-500" }
    ],
    chartPoints: "M10 60 T 50 30 T 90 70 T 130 20 T 170 50 T 210 10 T 250 40",
    steps: "8,420 steps",
    aiInsight: "Luna's activity is up 12% today. Ensure she gets extra water since it's warm.",
    reminders: [
      { time: "Tomorrow", text: "Rabies Vaccine Booster", urgent: true },
      { time: "6:00 PM", text: "Evening Walk & Fetch", urgent: false }
    ]
  },
  milo: {
    name: "Milo",
    breed: "Siamese Cat",
    age: "1 y/o",
    avatar: "🐈",
    healthScore: 94,
    healthStatus: "Healthy & Active",
    metrics: [
      { label: "Heart Rate", value: "115 bpm", color: "text-rose-500" },
      { label: "Active Calories", value: "190 kcal", color: "text-orange-500" },
      { label: "Sleep Quality", value: "88%", color: "text-indigo-500" }
    ],
    chartPoints: "M10 40 T 50 80 T 90 20 T 130 60 T 170 30 T 210 70 T 250 50",
    steps: "3,150 runs & jumps",
    aiInsight: "Milo has slept slightly longer than usual. Monitor his water intake today.",
    reminders: [
      { time: "Friday", text: "Hairball Treatment Dose", urgent: false },
      { time: "Next Wk", text: "Flea & Tick Prevention", urgent: false }
    ]
  }
};

const DashboardMockup = () => {
  const [activePet, setActivePet] = useState("luna");
  const pet = PET_DATA[activePet];

  return (
    <GlassCard hover={false} className="w-full border border-slate-200/60 bg-white/80 p-0 shadow-2xl">
      {/* Browser Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200/50 bg-slate-50/50 px-6 py-4">
        <div className="flex gap-2">
          <div className="h-3.5 w-3.5 rounded-full bg-rose-400" />
          <div className="h-3.5 w-3.5 rounded-full bg-amber-400" />
          <div className="h-3.5 w-3.5 rounded-full bg-emerald-400" />
        </div>
        <div className="hidden rounded-lg bg-slate-100 px-10 py-1.5 text-xs text-slate-400 sm:block">
          dashboard.petverse.ai
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <Search size={18} className="cursor-pointer hover:text-emerald-500" />
          <div className="relative cursor-pointer hover:text-emerald-500">
            <Bell size={18} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      <div className="flex min-h-[500px] flex-col md:flex-row">
        {/* Mock Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-slate-200/50 bg-slate-50/20 p-6 md:flex">
          <div className="mb-8 flex items-center gap-2 font-bold text-slate-800">
            <div className="h-7 w-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs">PV</div>
            PetVerse <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <nav className="flex-1 space-y-1.5">
            {[
              { label: "Overview", icon: LayoutDashboard, active: true },
              { label: "AI Health Guide", icon: Brain },
              { label: "Pet Profiles", icon: User },
              { label: "Appointments", icon: Calendar },
              { label: "Premium Shop", icon: ShoppingBag }
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition cursor-pointer ${
                  item.active ? "bg-emerald-50 text-emerald-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </div>
            ))}
          </nav>

          {/* Quick Pet Switcher */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <p className="mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">My Pets</p>
            <div className="flex gap-3">
              {Object.keys(PET_DATA).map((key) => (
                <button
                  key={key}
                  onClick={() => setActivePet(key)}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-all ${
                    activePet === key
                      ? "bg-emerald-500 text-white shadow-md ring-2 ring-emerald-500 ring-offset-2"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {PET_DATA[key].avatar}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 md:p-8 bg-slate-50/30">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h4 className="text-xl font-bold text-slate-800">Welcome back, Shreyash!</h4>
              <p className="text-sm text-slate-500">Here is how {pet.name} is doing today.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-400 md:hidden">Switch Pet:</span>
              <div className="flex gap-2 md:hidden">
                {Object.keys(PET_DATA).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActivePet(key)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all ${
                      activePet === key ? "bg-emerald-500 text-white" : "bg-slate-100"
                    }`}
                  >
                    {PET_DATA[key].avatar}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Health Score Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400">Health Index</span>
                <Heart className="text-rose-500" size={18} />
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  {/* SVG progress circle */}
                  <svg className="absolute top-0 left-0 h-full w-full -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-slate-100 fill-none" strokeWidth="6" />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="34"
                      className="stroke-emerald-500 fill-none"
                      strokeWidth="6"
                      strokeDasharray="213"
                      initial={{ strokeDashoffset: 213 }}
                      animate={{ strokeDashoffset: 213 - (213 * pet.healthScore) / 100 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <span className="text-lg font-extrabold text-slate-800">{pet.healthScore}%</span>
                </div>
                <div>
                  <h5 className="font-bold text-slate-700">{pet.name}</h5>
                  <p className="text-xs text-emerald-600 font-semibold">{pet.healthStatus}</p>
                  <p className="text-xs text-slate-400">{pet.breed} • {pet.age}</p>
                </div>
              </div>
            </div>

            {/* Steps & Activity Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400">Activity Level</span>
                <Activity className="text-emerald-500" size={18} />
              </div>
              <div className="mb-2">
                <span className="text-2xl font-extrabold text-slate-800">{pet.steps}</span>
              </div>
              {/* Activity Mini Sparkline */}
              <div className="h-12 w-full pt-2">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 260 80">
                  <motion.path
                    key={activePet}
                    d={pet.chartPoints}
                    fill="none"
                    className="stroke-emerald-400"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </svg>
              </div>
            </div>

            {/* AI Insight Card */}
            <div className="col-span-1 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6 shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-emerald-100 p-1.5 text-emerald-600">
                  <Brain size={16} />
                </div>
                <span className="text-sm font-bold text-emerald-800">PetVerse AI Insight</span>
              </div>
              <p className="mb-4 text-sm leading-6 text-slate-600 h-24 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activePet}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {pet.aiInsight}
                  </motion.span>
                </AnimatePresence>
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 cursor-pointer hover:underline">
                Ask AI Vet <Sparkles size={12} className="animate-bounce" />
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="col-span-1 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
              <h5 className="mb-4 text-sm font-bold text-slate-400">Daily Vitals Breakdown</h5>
              <div className="grid gap-4 grid-cols-3">
                {pet.metrics.map((m, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-50 p-4 text-center">
                    <p className="text-xs text-slate-400 font-medium mb-1">{m.label}</p>
                    <p className={`text-sm md:text-base font-extrabold ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reminders Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h5 className="mb-4 text-sm font-bold text-slate-400">Upcoming Reminders</h5>
              <div className="space-y-3">
                {pet.reminders.map((r, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
                    <div>
                      <p className="font-bold text-slate-700">{r.text}</p>
                      <p className="text-slate-400 mt-0.5">{r.time}</p>
                    </div>
                    {r.urgent ? (
                      <Badge variant="danger" className="text-[10px] px-2 py-0.5 font-bold">Urgent</Badge>
                    ) : (
                      <Badge variant="primary" className="text-[10px] px-2 py-0.5 font-bold">Scheduled</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </GlassCard>
  );
};

export default DashboardMockup;
