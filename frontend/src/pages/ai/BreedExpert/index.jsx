import React, { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { useAIContext } from "@/hooks/useAIContext";
import { Brain, Star, BookOpen, ShieldAlert, Award, Calendar } from "lucide-react";
import HealthHeader from "@/components/health/shared/HealthHeader";
import StatisticCard from "@/components/health/shared/StatisticCard";
import AIInsightCard from "@/components/ai/cards/AIInsightCard";
import RecommendationCard from "@/components/ai/cards/RecommendationCard";

export default function BreedExpertView() {
  const breedKnowledge = [];
  const context = useAIContext();
  const { activePet, healthDomain } = context;
  const { pets, selectedPetId, changeSelectedPet } = healthDomain;

  const breedInfo = useMemo(() => {
    if (!activePet) return null;
    return breedKnowledge[activePet.breed] || null;
  }, [activePet]);

  if (!activePet) {
    return (
      <DashboardLayout pageTitle="Breed Expert System" pageDescription="Breed profiles.">
        <div className="flex h-64 items-center justify-center">
          <p className="font-bold text-slate-400">Loading breed facts...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      pageTitle={`${activePet.name} — Breed Expert`}
      pageDescription={`Explore breed history, genetic risks, exercise requirements, and grooming instructions for ${activePet.breed}s.`}
    >
      <div className="space-y-8">
        {/* Header */}
        <HealthHeader
          pets={pets}
          selectedPetId={selectedPetId}
          onChangePet={changeSelectedPet}
          accentColor="violet"
        />

        {/* Breed Profile Metrics */}
        {breedInfo ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatisticCard
                label="Life Expectancy"
                value={breedInfo.lifeExpectancy}
                icon={Calendar}
                iconColor="text-violet-600"
                iconBg="bg-violet-50"
              />
              <StatisticCard
                label="Daily Exercise"
                value={breedInfo.exercise?.daily || "--"}
                icon={Brain}
                iconColor="text-emerald-600"
                iconBg="bg-emerald-50"
              />
              <StatisticCard
                label="Breed Size"
                value={breedInfo.size || "--"}
                icon={Award}
                iconColor="text-cyan-600"
                iconBg="bg-cyan-50"
              />
              <StatisticCard
                label="Origin Region"
                value={breedInfo.origin?.split(",")[0] || "--"}
                icon={BookOpen}
                iconColor="text-indigo-600"
                iconBg="bg-indigo-50"
              />
            </div>

            {/* Layout Grid */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left: General info and training */}
              <div className="lg:col-span-8 space-y-6">
                {/* Overview */}
                <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <BookOpen size={18} className="text-violet-500" />
                    <span>Breed Overview & Temperament</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {breedInfo.temperament?.map((t, idx) => (
                      <span key={idx} className="rounded-full bg-violet-50 border border-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-slate-500 leading-relaxed pt-2">
                    {activePet.name} belongs to the **{activePet.breed}** lineage. {breedInfo.training}
                  </p>
                </div>

                {/* Genetic Diseases Checklist */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <ShieldAlert size={18} className="text-rose-500" />
                    <span>Genetic & Common Conditions Checklist</span>
                  </h3>
                  <div className="space-y-3">
                    {breedInfo.commonDiseases?.map((d, idx) => (
                      <AIInsightCard
                        key={idx}
                        title={d.name}
                        description={d.description}
                        severity={d.risk === "Very High" || d.risk === "High" ? "warning" : "info"}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Grooming and exercise targets */}
              <div className="lg:col-span-4 space-y-6">
                {/* Exercise plan */}
                <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h4 className="text-base font-black text-slate-800 tracking-tight">Exercise Standards</h4>
                  <p className="text-xs font-semibold text-slate-400">Target exercise limit for this breed:</p>
                  <span className="text-2xl font-black text-slate-800 block">{breedInfo.exercise?.daily}</span>
                  <div className="space-y-1.5 border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Recommended Styles</span>
                    <ul className="list-disc pl-4 text-xs font-semibold text-slate-600 space-y-1">
                      {breedInfo.exercise?.type?.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Grooming Tasks */}
                <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h4 className="text-base font-black text-slate-800 tracking-tight">Grooming & Shedding Guidelines</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Brushing</span>
                      <span className="font-extrabold text-slate-700">{breedInfo.grooming?.brushingFrequency}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Bathing</span>
                      <span className="font-extrabold text-slate-700">{breedInfo.grooming?.bathingFrequency}</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    {breedInfo.grooming?.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[30px] border border-dashed border-slate-200 p-16 text-center bg-white">
            <Brain className="mx-auto mb-4 text-slate-300" size={32} />
            <h3 className="text-lg font-black text-slate-700">No breed profile metadata found</h3>
            <p className="text-sm font-semibold text-slate-400 mt-1">
              We couldn't locate breed information for {activePet.breed} in our database.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
