import { HeartPulse, PawPrint, Scale, ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PetStatusBadge from "../shared/PetStatusBadge";

export default function PetCard({ pet }) {
  if (!pet) return null;

  const getHealthStatus = (score) => {
    if (score > 85) return "Healthy";
    if (score > 60) return "Vaccination Due";
    return "Needs Checkup";
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years === 0) return `${months} m`;
    return `${years} y${months > 0 ? ` ${months}m` : ""}`;
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-slate-200/70
        bg-white/90
        backdrop-blur-md
        shadow-sm
        transition-all
        hover:border-emerald-200
        hover:shadow-xl
      "
    >
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={pet.profileImage}
          alt={pet.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <PetStatusBadge status={getHealthStatus(pet.healthScore)} />
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
              {pet.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-400">
              {pet.breed}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
            <span className="text-xs font-bold uppercase">{pet.gender === "Male" ? "M" : "F"}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-50/80 p-3.5 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <PawPrint size={14} className="text-emerald-500" />
              <span className="text-xs font-medium">Species</span>
            </div>
            <h4 className="font-bold text-slate-800 text-sm">
              {pet.species}
            </h4>
          </div>

          <div className="rounded-2xl bg-slate-50/80 p-3.5 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Scale size={14} className="text-cyan-500" />
              <span className="text-xs font-medium">Weight</span>
            </div>
            <h4 className="font-bold text-slate-800 text-sm">
              {pet.weight} kg
            </h4>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-500">
              Age: <span className="font-bold text-slate-700">{calculateAge(pet.birthDate)}</span>
            </span>
          </div>

          <Link
            to={`/pets/${pet.id}`}
            className="
              flex
              items-center
              gap-1.5
              text-sm
              font-bold
              text-emerald-600
              transition-all
              group-hover:gap-2.5
            "
          >
            <span>View Profile</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
