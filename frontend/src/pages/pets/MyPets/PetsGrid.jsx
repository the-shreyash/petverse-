import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { usePets } from "@/hooks/usePets";
import PetCard from "./PetCard";

const PetsGrid = () => {
  const { pets, loading } = usePets();

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
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 font-semibold text-white transition hover:-translate-y-1 hover:shadow-xl"
        >
          <Plus size={18} />
          Add Pet
        </Link>
      </div>

      {loading ? (
        <div className="py-10 text-center text-slate-500">Loading pets...</div>
      ) : pets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16">
          <div className="rounded-full bg-emerald-100 p-4 text-emerald-600 mb-4">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No pets yet</h3>
          <p className="text-slate-500 max-w-md text-center mb-6">
            Add your first pet to start tracking their health, setting reminders, and getting personalized AI insights.
          </p>
          <Link
            to="/pets/add"
            className="rounded-full bg-emerald-500 px-6 py-2.5 font-medium text-white hover:bg-emerald-600 transition"
          >
            Add Your First Pet
          </Link>
        </div>
      )}
    </section>
  );
};

export default PetsGrid;