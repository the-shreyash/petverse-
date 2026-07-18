import { ArrowRight, PawPrint, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePets } from "@/hooks/usePets";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8000";

function getImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
  return `${BACKEND_URL}${url}`;
}

const SPECIES_EMOJI = {
  Dog: "🐕",
  Cat: "🐈",
  Bird: "🐦",
  Rabbit: "🐇",
  Reptile: "🦎",
  Fish: "🐟",
  Other: "🐾"
};

const MyPetsOverview = () => {
  const { pets, loading } = usePets();
  const displayPets = pets.slice(0, 4); // Show max 4 on dashboard

  return (
    <section>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">My Pets</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Your Pet Family</h2>
        </div>

        <div className="flex gap-3">
          <Link
            to="/pets"
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            View All
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/pets/add"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:-translate-y-1"
          >
            <Plus size={16} />
            Add Pet
          </Link>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 rounded-3xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : displayPets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 py-12 text-center">
          <PawPrint size={40} className="text-slate-300 mb-3" />
          <p className="font-bold text-slate-600">No pets yet</p>
          <p className="text-sm text-slate-400 mt-1 mb-4">Add your first pet to get started.</p>
          <Link
            to="/pets/add"
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 transition"
          >
            <Plus size={14} />
            Add First Pet
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {displayPets.map((pet) => {
            const imageUrl = getImageUrl(pet.profile_image);
            const emoji = SPECIES_EMOJI[pet.species] || "🐾";

            return (
              <motion.div
                whileHover={{ y: -5 }}
                key={pet.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex">
                  {/* Image or emoji fallback */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={pet.name}
                      className="h-40 w-40 object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-40 w-40 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">
                      <span className="text-5xl">{emoji}</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <PawPrint size={16} className="text-emerald-500" />
                        <h3 className="text-xl font-bold text-slate-900">{pet.name}</h3>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {pet.breed || pet.species}
                      </p>

                      {pet.age && (
                        <p className="mt-0.5 text-xs text-slate-400">{pet.age} old</p>
                      )}

                      {pet.gender && (
                        <span className="mt-2 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {pet.gender}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {pet.status || "Active"}
                      </span>

                      <Link
                        to={`/pets/${pet.id}`}
                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        View Profile →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyPetsOverview;