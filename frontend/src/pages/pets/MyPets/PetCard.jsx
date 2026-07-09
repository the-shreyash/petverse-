import {
  HeartPulse,
  PawPrint,
  Scale,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const statusStyles = {
  Healthy: "bg-emerald-100 text-emerald-700",
  "Vaccination Due": "bg-amber-100 text-amber-700",
  "Needs Checkup": "bg-red-100 text-red-700",
};

const PetCard = ({ pet }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        hover:shadow-xl
      "
    >
      <img
        src={pet.image}
        alt={pet.name}
        className="h-60 w-full object-cover"
      />

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>

            <h3 className="text-2xl font-bold text-slate-900">
              {pet.name}
            </h3>

            <p className="mt-1 text-slate-500">
              {pet.breed}
            </p>

          </div>

          <span
            className={`rounded-full px-3 py-2 text-xs font-semibold ${statusStyles[pet.health]}`}
          >
            {pet.health}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">

          <div className="rounded-2xl bg-slate-50 p-4">

            <PawPrint
              size={18}
              className="mb-2 text-emerald-500"
            />

            <p className="text-sm text-slate-500">
              Species
            </p>

            <h4 className="font-semibold">
              {pet.species}
            </h4>

          </div>

          <div className="rounded-2xl bg-slate-50 p-4">

            <Scale
              size={18}
              className="mb-2 text-cyan-500"
            />

            <p className="text-sm text-slate-500">
              Weight
            </p>

            <h4 className="font-semibold">
              {pet.weight}
            </h4>

          </div>

        </div>

        <div className="mt-6 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <HeartPulse
              size={18}
              className="text-rose-500"
            />

            <span className="text-sm text-slate-600">
              {pet.age}
            </span>

          </div>

          <Link
            to={`/pets/${pet.id}`}
            className="
              flex
              items-center
              gap-2
              font-semibold
              text-emerald-600
              transition
              hover:gap-3
            "
          >
            View Profile

            <ArrowRight size={18} />
          </Link>

        </div>
      </div>
    </motion.div>
  );
};

export default PetCard;