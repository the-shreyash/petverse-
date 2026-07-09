import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Edit3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import PetAvatar from "./PetAvatar";
import PetStatusBadge from "./PetStatusBadge";

export default function PetHeader({ pet, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      {/* Back and Avatar Info */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/pets")}
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-200
            bg-white
            text-slate-600
            transition-all
            hover:bg-slate-50
            hover:text-slate-900
            shadow-sm
          "
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-4">
          <PetAvatar
            src={pet.profileImage}
            name={pet.name}
            species={pet.species}
            size="lg"
            status={pet.healthScore > 85 ? "Healthy" : pet.healthScore > 60 ? "Vaccination Due" : "Needs Checkup"}
          />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {pet.name}
              </h1>
              <PetStatusBadge
                status={pet.healthScore > 85 ? "Healthy" : pet.healthScore > 60 ? "Vaccination Due" : "Needs Checkup"}
              />
            </div>
            <p className="mt-1 text-slate-500 font-medium">
              {pet.breed} • {pet.species}
            </p>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <Link
          to={`/pets/${pet.id}/edit`}
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            font-semibold
            text-slate-600
            transition-all
            hover:bg-slate-50
            hover:text-slate-900
            shadow-sm
          "
        >
          <Edit3 size={16} />
          <span>Edit Profile</span>
        </Link>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (confirm(`Are you sure you want to delete ${pet.name}?`)) {
              onDelete();
            }
          }}
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-rose-50
            border
            border-rose-100
            px-4
            py-3
            font-semibold
            text-rose-600
            transition-all
            hover:bg-rose-100
          "
        >
          <Trash2 size={16} />
          <span>Delete Pet</span>
        </motion.button>
      </div>
    </div>
  );
}
