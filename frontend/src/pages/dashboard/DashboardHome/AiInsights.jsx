import {
  ArrowRight,
  Bot,
  Brain,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useHealth } from "@/hooks/useHealth";

const priorityStyles = {
  low: "bg-cyan-100 text-cyan-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

const AIInsights = () => {
  const { selectedPet, records } = useHealth();
  const petName = selectedPet?.name || "your pet";

  const dynamicInsights = [
    {
      id: "ai-1",
      title: "Health Check",
      description: records.length > 0 ? `Based on ${petName}'s recent records, their health looks stable.` : `No recent health records found for ${petName}. Add a checkup record to get personalized insights.`,
      priority: records.length > 0 ? "low" : "medium"
    },
    {
      id: "ai-2",
      title: "Activity Monitoring",
      description: `Ensure ${petName} gets at least 30 minutes of daily exercise to maintain an active lifestyle.`,
      priority: "low"
    }
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="text-emerald-500" />
            <p className="font-medium text-emerald-600">AI Assistant</p>
          </div>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Today's AI Insights</h2>
          <p className="mt-2 text-slate-500">Personalized recommendations based on real context.</p>
        </div>
        <Link to="/ai" className="flex items-center gap-2 font-medium text-emerald-600 hover:text-emerald-700 shrink-0">
          Open AI <ArrowRight size={18} />
        </Link>
      </div>

      {/* Hero Card */}
      <motion.div
        whileHover={{ y: -4 }}
        className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-7 text-white"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={18} />
              <span className="font-medium">AI Recommendation</span>
            </div>
            <h3 className="text-2xl font-bold">
              {petName} is doing great 🎉
            </h3>
            <p className="mt-3 max-w-2xl text-white/90">
              Continue the current nutrition plan. Ensure you track any new health milestones or checkups to keep the AI updated.
            </p>
          </div>
          <Brain size={42} className="hidden sm:block" />
        </div>
      </motion.div>

      {/* Insights */}
      <div className="space-y-5">
        {dynamicInsights.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ x: 4 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-100 p-5 transition-all hover:border-emerald-200 gap-4"
          >
            <div className="flex gap-4 items-start">
              <div className="rounded-2xl bg-emerald-100 p-3 shrink-0">
                <Bot size={20} className="text-emerald-600" />
              </div>
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${priorityStyles[item.priority]}`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-slate-500">{item.description}</p>
              </div>
            </div>
            <TriangleAlert className="text-slate-300 shrink-0 self-end sm:self-auto" size={18} />
          </motion.div>
        ))}

      </div>

      {/* Footer */}

      <div className="mt-8 flex justify-end">

        <Link
          to="/ai"
          className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-medium text-white transition hover:shadow-xl"
        >
          Ask PetVerse AI
        </Link>

      </div>

    </section>
  );
};

export default AIInsights;