import { ArrowRight, PawPrint, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const pets = [
  {
    id: 1,
    name: "somesh sharma",
    breed: "Golden Retriever",
    age: "21 Years",
    health: "Healthy",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
  },
  {
    id: 2,
    name: "Milo",
    breed: "Persian Cat",
    age: "2 Years",
    health: "Vaccination Due",
    image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400",
  },
];

const MyPetsOverview = () => {
  return (
    <section>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            My Pets
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Your Pet Family
          </h2>
        </div>

        <div className="flex gap-3">
          <Link
            to="/pets"
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            View All

            <ArrowRight size={18} />
          </Link>

          <button
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 font-medium text-white shadow-lg transition hover:-translate-y-1"
          >
            <Plus size={18} />

            Add Pet
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {pets.map((pet) => (
          <motion.div
            whileHover={{ y: -5 }}
            key={pet.id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex">
              {/* Image */}
              <img
                src={pet.image}
                alt={pet.name}
                className="h-56 w-48 object-cover"
              />

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <PawPrint
                      size={18}
                      className="text-emerald-500"
                    />

                    <h3 className="text-2xl font-bold text-slate-900">
                      {pet.name}
                    </h3>
                  </div>

                  <p className="mt-2 text-slate-500">
                    {pet.breed}
                  </p>

                  <p className="mt-1 text-slate-500">
                    {pet.age}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      pet.health === "Healthy"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {pet.health}
                  </span>

                  <Link
                    to={`/pets/${pet.id}`}
                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MyPetsOverview;