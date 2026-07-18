import React from "react";
import { PawPrint, Calendar, Scale, Shield, User, HeartPulse, Palette } from "lucide-react";

export default function PetInformationGrid({ pet }) {
  if (!pet) return null;

  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }
    
    if (years === 0) {
      return `${months} Month${months !== 1 ? "s" : ""}`;
    }
    return `${years} Year${years !== 1 ? "s" : ""}${months > 0 ? ` ${months} Mo` : ""}`;
  };

  const details = [
    {
      icon: PawPrint,
      label: "Species & Breed",
      value: `${pet.species || "N/A"} • ${pet.breed || "N/A"}`,
      color: "text-emerald-500 bg-emerald-50",
    },
    {
      icon: HeartPulse,
      label: "Gender",
      value: pet.gender || "N/A",
      color: "text-rose-500 bg-rose-50",
    },
    {
      icon: Calendar,
      label: "Age / Birth Date",
      value: `${calculateAge(pet.birthDate)} (${pet.birthDate || "N/A"})`,
      color: "text-cyan-500 bg-cyan-50",
    },
    {
      icon: Scale,
      label: "Weight",
      value: pet.weight ? `${pet.weight} kg` : "N/A",
      color: "text-amber-500 bg-amber-50",
    },
    {
      icon: Palette,
      label: "Coat Color",
      value: pet.color || "N/A",
      color: "text-indigo-500 bg-indigo-50",
    },
    {
      icon: Shield,
      label: "Microchip ID",
      value: pet.microchip || "Not Microchipped",
      color: "text-purple-500 bg-purple-50",
    },
    {
      icon: User,
      label: "Owner",
      value: pet.owner || "You",
      color: "text-teal-500 bg-teal-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {details.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="
              flex
              items-start
              gap-4
              rounded-3xl
              border
              border-slate-200/60
              bg-white/95
              p-5
              shadow-sm
              transition-all
              hover:shadow-md
            "
          >
            <div className={`rounded-2xl p-3 shrink-0 ${item.color}`}>
              <Icon size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {item.label}
              </p>
              <h4 className="text-base font-bold text-slate-800">
                {item.value}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}
