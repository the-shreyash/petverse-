import React, { useState } from "react";
import { Pill, Check, Clock, Calendar, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

export default function MedicationCard({
  medication,
  onLogDose
}) {
  const {
    name,
    dosage,
    frequency,
    duration,
    completed = false,
    missed = false
  } = medication;

  // Let's create visual check states for today's dosage.
  // We can parse the frequency to decide how many doses.
  const getDoseTimes = (freq) => {
    const f = freq.toLowerCase();
    if (f.includes("three") || f.includes("3 times")) return ["Morning", "Afternoon", "Evening"];
    if (f.includes("twice") || f.includes("2 times") || f.includes("2x")) return ["Morning", "Evening"];
    return ["Daily Dose"];
  };

  const doseTimes = getDoseTimes(frequency);
  const [takenDoses, setTakenDoses] = useState({});

  const toggleDose = (time) => {
    const nextStates = { ...takenDoses, [time]: !takenDoses[time] };
    setTakenDoses(nextStates);
    if (onLogDose) {
      onLogDose(name, time, nextStates[time]);
    }
  };

  // Mock progress calculation (e.g. Day 5 of 7)
  const totalDays = parseInt(duration) || 7;
  const currentDay = Math.min(4, totalDays); // mock day
  const percentCompleted = Math.round((currentDay / totalDays) * 100);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 shadow-inner">
            <Pill size={20} />
          </div>
          <div>
            <h4 className="text-base font-black text-slate-800 tracking-tight">{name}</h4>
            <p className="mt-0.5 text-xs text-slate-500 font-semibold">{dosage} • {frequency}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            <span>Course: {duration}</span>
          </span>
          <span>{percentCompleted}% Complete</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentCompleted}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
          />
        </div>
      </div>

      {/* Log Today's Doses */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Clock size={12} />
          <span>Administer Today's Dose</span>
        </h5>
        
        <div className="grid gap-2 grid-cols-3">
          {doseTimes.map((time) => {
            const isTaken = !!takenDoses[time];
            return (
              <button
                key={time}
                onClick={() => toggleDose(time)}
                className={`
                  flex
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  py-2.5
                  px-2
                  border
                  transition-all
                  ${
                    isTaken
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-black shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                  }
                `}
              >
                <span className="text-[10px] tracking-wide uppercase mb-1">{time}</span>
                {isTaken ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white"
                  >
                    <Check size={12} strokeWidth={3} />
                  </motion.div>
                ) : (
                  <div className="h-5 w-5 rounded-full border border-slate-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Adherence Check */}
      <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
        <BarChart2 size={13} className="text-indigo-500" />
        <span>Adherence Rate: 100% (No missed doses registered)</span>
      </div>
    </motion.div>
  );
}
