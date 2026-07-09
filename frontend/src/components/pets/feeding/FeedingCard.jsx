import React, { useState } from "react";
import { Coffee, Flame, AlertCircle, CheckCircle, Info } from "lucide-react";

export default function FeedingCard({ feedingPreferences }) {
  const defaultFeeding = {
    foodType: "Dry Kibble",
    frequency: "2 times daily",
    portionSize: "1.5 cups",
    allergies: "None",
    notes: "Serve at routine times."
  };

  const preferences = feedingPreferences || defaultFeeding;
  
  // Track meals logged for today
  const [meals, setMeals] = useState([
    { id: 1, name: "Breakfast", completed: true },
    { id: 2, name: "Dinner", completed: false }
  ]);

  const toggleMeal = (id) => {
    setMeals((prev) =>
      prev.map((meal) => (meal.id === id ? { ...meal, completed: !meal.completed } : meal))
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200/60 bg-white/90 backdrop-blur-md p-6 shadow-sm">
      <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
        <Coffee size={20} className="text-emerald-500" />
        Feeding Preferences & Schedule
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Diet Specs */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-100 flex items-start gap-3">
            <div className="rounded-xl bg-white p-2 text-emerald-500 border border-slate-100 shrink-0">
              <Flame size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diet & Portions</p>
              <h4 className="font-extrabold text-slate-800 text-sm mt-0.5">{preferences.foodType}</h4>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Portion: <span className="text-emerald-600 font-extrabold">{preferences.portionSize}</span> • {preferences.frequency}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-rose-50/30 p-4 border border-rose-100/50 flex items-start gap-3">
            <div className="rounded-xl bg-white p-2 text-rose-500 border border-rose-100 shrink-0">
              <AlertCircle size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Allergies & Restrictions</p>
              <h4 className="font-extrabold text-slate-800 text-sm mt-0.5">{preferences.allergies}</h4>
            </div>
          </div>
        </div>

        {/* Dynamic Meal Tracker */}
        <div className="rounded-2xl bg-slate-50/40 p-4 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Today's Feeding Tracker</p>
          <div className="space-y-2">
            {meals.map((meal) => (
              <button
                key={meal.id}
                onClick={() => toggleMeal(meal.id)}
                className={`
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  border
                  p-3
                  text-left
                  transition-all
                  ${
                    meal.completed
                      ? "bg-emerald-50/40 border-emerald-200/50 text-slate-700"
                      : "bg-white border-slate-200/80 text-slate-500 hover:border-slate-300"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className={meal.completed ? "text-emerald-500" : "text-slate-300"} />
                  <span className="text-sm font-bold">{meal.name}</span>
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {meal.completed ? "Fed" : "Log Feed"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {preferences.notes && (
        <div className="mt-4 rounded-2xl bg-cyan-50/30 p-4 border border-cyan-100/50 flex gap-2">
          <Info size={16} className="text-cyan-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            {preferences.notes}
          </p>
        </div>
      )}
    </div>
  );
}
