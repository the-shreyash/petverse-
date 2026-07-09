import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { pets } from "@/mock/pets";

import PetCard from "./PetCard";

const PetsGrid = () => {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Pet Collection
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            Your Pets
          </h2>
        </div>

        <Link
          to="/pets/add"
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-gradient-to-r
            from-emerald-500
            to-cyan-500
            px-5
            py-3
            font-semibold
            text-white
            transition
            hover:-translate-y-1
            hover:shadow-xl
          "
        >
          <Plus size={18} />

          Add Pet
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {pets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
          />
        ))}
      </div>
    </section>
  );
};

export default PetsGrid;