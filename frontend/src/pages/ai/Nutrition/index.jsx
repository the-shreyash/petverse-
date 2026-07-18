import React, { useMemo } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { useAIContext } from "@/hooks/useAIContext";
import { Sparkles, Calendar, ShieldAlert, UtensilsCrossed, AlertTriangle } from "lucide-react";
import HealthHeader from "@/components/health/shared/HealthHeader";
import StatisticCard from "@/components/health/shared/StatisticCard";

export default function NutritionView() {
  const nutritionData = [];
  const breedKnowledge = [];
  const context = useAIContext();
  const { activePet, healthDomain, feeding } = context;
  const { pets, selectedPetId, changeSelectedPet } = healthDomain;

  const nutritionInfo = useMemo(() => {
    if (!activePet) return null;
    return nutritionData[activePet.breed] || null;
  }, [activePet]);

  const breedInfo = useMemo(() => {
    if (!activePet) return null;
    return breedKnowledge[activePet.breed] || null;
  }, [activePet]);

  if (!activePet) {
    return (
      <DashboardLayout pageTitle="AI Nutrition Advisor" pageDescription="Dietary targets.">
        <div className="flex h-64 items-center justify-center">
          <p className="font-bold text-slate-400">Loading diet plan...</p>
        </div>
      </DashboardLayout>
    );
  }

  const defaultAgeGroup = nutritionInfo?.ageGroups?.[1] || {
    calories: "1,300–1,700 kcal",
    protein: "22%",
    fat: "12%",
    meals: 2,
    portionKg: "2 cups"
  };

  return (
    <DashboardLayout
      pageTitle={`${activePet.name} — Nutrition Advisor`}
      pageDescription="Breed-specific calorie calculation, recommended diet types, safe foods, and daily meal plans."
    >
      <div className="space-y-8">
        {/* Header */}
        <HealthHeader
          pets={pets}
          selectedPetId={selectedPetId}
          onChangePet={changeSelectedPet}
          accentColor="amber"
        />

        {nutritionInfo ? (
          <div className="space-y-8">
            {/* Top Stat Row */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatisticCard
                label="Target Calories"
                value={defaultAgeGroup.calories}
                icon={UtensilsCrossed}
                iconColor="text-amber-600"
                iconBg="bg-amber-50"
              />
              <StatisticCard
                label="Water Target"
                value={nutritionInfo.waterIntake}
                icon={Calendar}
                iconColor="text-cyan-600"
                iconBg="bg-cyan-50"
              />
              <StatisticCard
                label="Meals / Day"
                value={defaultAgeGroup.meals}
                icon={Sparkles}
                iconColor="text-emerald-600"
                iconBg="bg-emerald-50"
              />
              <StatisticCard
                label="Allergies"
                value={feeding?.allergies || "None logged"}
                icon={ShieldAlert}
                iconColor="text-rose-500"
                iconBg="bg-rose-50"
              />
            </div>

            {/* Layout Grid */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left: Calorie targets, age group matrices */}
              <div className="lg:col-span-8 space-y-6">
                {/* Age Group Calories Table */}
                <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Calorie & Macro Requirements by Age</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-semibold">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] tracking-wider">
                          <th className="py-3 pr-4">Age Stage</th>
                          <th className="py-3 px-4">Calorie Range</th>
                          <th className="py-3 px-4">Min Protein</th>
                          <th className="py-3 px-4">Min Fat</th>
                          <th className="py-3 px-4 text-right">Ideal Portions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nutritionInfo.ageGroups?.map((group, idx) => (
                          <tr key={idx} className="border-b border-slate-100/50 hover:bg-slate-50 transition">
                            <td className="py-3 pr-4 font-black text-slate-800">{group.age}</td>
                            <td className="py-3 px-4 text-slate-600">{group.calories}</td>
                            <td className="py-3 px-4 text-slate-600">{group.protein}</td>
                            <td className="py-3 px-4 text-slate-600">{group.fat}</td>
                            <td className="py-3 px-4 text-right text-slate-500">{group.portionKg}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Feeding schedule */}
                <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Recommended Meal Schedule</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {nutritionInfo.mealSchedule?.map((m, idx) => (
                      <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            {m.time}
                          </span>
                          <span className="text-xs font-black text-slate-800">{m.meal}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-600">Portion target: {m.portion}</p>
                        <p className="text-[11px] font-semibold text-slate-400 leading-normal">{m.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Brand lists, safe foods & alerts */}
              <div className="lg:col-span-4 space-y-6">
                {/* Safe food brands */}
                <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h4 className="text-base font-black text-slate-800 tracking-tight">Optimal Diet Brands</h4>
                  <ul className="space-y-2">
                    {nutritionInfo.idealFoods?.map((food, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs font-bold text-slate-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Avoid list */}
                {breedInfo?.diet?.avoidFoods && (
                  <div className="rounded-[30px] border border-rose-100 bg-rose-50/30 p-6 shadow-sm space-y-4">
                    <h4 className="text-base font-black text-rose-800 tracking-tight flex items-center gap-2">
                      <AlertTriangle size={18} className="text-rose-500 animate-pulse" />
                      <span>Foods to Avoid</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {breedInfo.diet.avoidFoods.map((food, idx) => (
                        <span key={idx} className="rounded-lg bg-rose-50 border border-rose-100 px-2.5 py-1 text-[10px] font-extrabold text-rose-700 uppercase tracking-wide">
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[30px] border border-dashed border-slate-200 p-16 text-center bg-white">
            <UtensilsCrossed className="mx-auto mb-4 text-slate-300" size={32} />
            <h3 className="text-lg font-black text-slate-700">No diet blueprint found</h3>
            <p className="text-sm font-semibold text-slate-400 mt-1">
              Diet targets are not mapped for {activePet.breed}.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
