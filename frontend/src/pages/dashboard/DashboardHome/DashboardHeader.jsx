import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const DashboardHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
    >
      {/* Left */}
      <div>
        <p className="text-sm font-medium text-emerald-600">
          👋 Welcome Back
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Good Morning, Shreyash
        </h1>

        <p className="mt-3 max-w-2xl text-slate-500">
          Here's a quick overview of your pets, health records,
          appointments, and AI insights for today.
        </p>
      </div>

      {/* Right */}
      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-500 to-cyan-500 p-5 text-white shadow-lg">
        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-white/20 p-3">
            <Sparkles size={22} />
          </div>

          <div>
            <p className="text-sm text-white/80">
              AI Daily Insight
            </p>

            <h3 className="font-semibold">
              Luna's vaccination is due in 2 days.
            </h3>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;