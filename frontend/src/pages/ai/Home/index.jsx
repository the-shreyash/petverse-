import React from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/layout";
import { useAIContext } from "@/hooks/useAIContext";
import { motion } from "framer-motion";
import {
  Bot,
  Brain,
  Sparkles,
  HeartPulse,
  Scale,
  Pill,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  Zap,
  Star,
  Activity
} from "lucide-react";
import HealthHeader from "@/components/health/shared/HealthHeader";
import StatisticCard from "@/components/health/shared/StatisticCard";
import RecommendationCard from "@/components/ai/cards/RecommendationCard";
import PetContextCard from "@/components/ai/cards/PetContextCard";
import HealthContextCard from "@/components/ai/cards/HealthContextCard";
import ActionCard from "@/components/ai/cards/ActionCard";

export default function AIHome() {
  const navigate = useNavigate();
  const context = useAIContext();
  const { activePet, healthDomain, health, weightHistory, medicalHistory, vaccinations } = context;
  const { pets, selectedPetId, changeSelectedPet } = healthDomain;

  if (!activePet) {
    return (
      <DashboardLayout pageTitle="AI Assistant" pageDescription="Intelligent layer.">
        {healthDomain.loading ? (
          <div className="flex h-64 items-center justify-center rounded-[30px] border border-dashed border-slate-200 bg-white">
            <p className="font-bold text-slate-400">Loading AI context...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] rounded-[30px] border border-dashed border-slate-300 bg-white p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 mb-6">
              <Bot size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">AI Assistant is Waiting</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
              To provide personalized insights, diet plans, and health analyses, the AI Assistant needs to know about your pets. Add your first pet to get started.
            </p>
            <Link
              to="/pets/add"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              <span>Add Your First Pet</span>
              <Sparkles size={16} />
            </Link>
          </div>
        )}
      </DashboardLayout>
    );
  }

  const latestRecord = medicalHistory[0] || null;
  const healthScore = activePet.healthScore || latestRecord?.healthScore || 90;

  const quickTools = [
    { label: "AI Health Analyst", path: "/ai/health-analysis", icon: HeartPulse, color: "text-emerald-500 bg-emerald-50", desc: "Risk indicators & summaries" },
    { label: "Breed Expert System", path: "/ai/breed-expert", icon: Brain, color: "text-violet-500 bg-violet-50", desc: "Common diseases & profiles" },
    { label: "Nutrition Planner", path: "/ai/nutrition", icon: Sparkles, color: "text-amber-500 bg-amber-50", desc: "Calorie target & safe foods" },
    { label: "Chat Assistant", path: "/ai/chat", icon: Bot, color: "text-indigo-500 bg-indigo-50", desc: "Conversational diagnostic guide" }
  ];

  return (
    <DashboardLayout
      pageTitle="AI Operating System"
      pageDescription="Intelligent diagnostics, health monitoring, and personalized care recommendations."
    >
      <div className="space-y-8">
        {/* Header (reusing HealthHeader pet selector) */}
        <HealthHeader
          pets={pets}
          selectedPetId={selectedPetId}
          onChangePet={changeSelectedPet}
          accentColor="emerald"
        />

        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-cyan-500/20 blur-2xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg">
                <Bot size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight">Active AI Intelligence</h2>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <p className="text-sm text-slate-400 font-semibold mt-0.5">
                  Consuming active health data from {activePet.name}'s medical records
                </p>
              </div>
            </div>
            <Link
              to="/ai/chat"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg transition hover:translate-y-[-1px]"
            >
              <span>Ask AI Chat</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatisticCard
            label="Wellness Score"
            value={healthScore}
            unit="%"
            icon={HeartPulse}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <StatisticCard
            label="Vaccines Compliance"
            value={vaccinations.length > 0 ? "Normal" : "Review"}
            icon={ShieldCheck}
            iconColor="text-teal-600"
            iconBg="bg-teal-50"
          />
          <StatisticCard
            label="Weight Logs"
            value={weightHistory.length}
            icon={Scale}
            iconColor="text-cyan-600"
            iconBg="bg-cyan-50"
          />
          <StatisticCard
            label="Clinical Audits"
            value={medicalHistory.length}
            icon={Stethoscope}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-50"
          />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Panel: Quick tools */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Tools Grid */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">AI Expert Modules</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {quickTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-emerald-400 hover:shadow-md"
                    >
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${tool.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-black text-slate-800 flex items-center gap-1">
                          <span>{tool.label}</span>
                          <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <p className="text-xs font-semibold text-slate-400 leading-relaxed">{tool.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Smart Recommendations */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-500" />
                <span>AI Recommendations & Core Actions</span>
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <RecommendationCard
                  title={`Booster Vaccines due for ${activePet.name}`}
                  description="Our immunisation check flags potential gaps in current core vaccinations. Schedule booster checks soon."
                  confidence={98}
                  reasoning={`Based on breed lifespan rules and missing FVRCP log dates for ${activePet.name}.`}
                  actionLabel="Schedule Vaccines"
                  onAction={() => navigate("/health/vaccinations")}
                  accent="emerald"
                />
                <RecommendationCard
                  title="Daily Joint Supplement Support"
                  description="We recommend adding Glucosamine supplements to breakfast portions to sustain skeletal wellness."
                  confidence={92}
                  reasoning={`Large breed standard metrics and recent weight logs of ${activePet.name} suggest precautionary joint support.`}
                  actionLabel="Shop Supplements"
                  onAction={() => navigate("/shop")}
                  accent="indigo"
                />
              </div>
            </div>
          </div>

          {/* Right Panel: Sidebars */}
          <div className="lg:col-span-4 space-y-6">
            {/* Pet Context */}
            <PetContextCard activePet={activePet} />

            {/* Health Context */}
            <HealthContextCard
              activePet={activePet}
              healthState={health}
              healthScore={healthScore}
            />

            {/* AI Next Best Action alert */}
            <ActionCard
              title="Verify Vitals Compliance"
              description="A physical clinical assessment was logged recently. Double-check your next vet appointment window."
              badge="Urgent Recommendation"
              to="/health/appointments"
              actionLabel="View Appointments"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
