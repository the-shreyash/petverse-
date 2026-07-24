import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, Filter, AlertTriangle, MessageSquare } from "lucide-react";
import GlassCard from "../../components/ui/GlassCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const ADOPT_PETS = [
  { id: 1, name: "Buddy", breed: "Golden Retriever", age: "3 months", category: "dog", icon: "🐕", desc: "Super friendly, loves playing fetch." },
  { id: 2, name: "Oliver", breed: "Siamese Kitten", age: "2 months", category: "cat", icon: "🐈", desc: "Very cuddly, loves warmth and string toys." },
  { id: 3, name: "Bella", breed: "Beagle Puppy", age: "4 months", category: "dog", icon: "🐶", desc: "Curious scent tracker, great with kids." },
  { id: 4, name: "Cleo", breed: "British Shorthair", age: "5 months", category: "cat", icon: "🐱", desc: "Calm and quiet companion, very gentle." }
];

const AdoptionConsole = () => {
  const [filter, setFilter] = useState("all");
  const [adoptedList, setAdoptedList] = useState([]);

  const filteredPets = ADOPT_PETS.filter(
    (pet) => filter === "all" || pet.category === filter
  );

  const toggleAdopt = (id) => {
    setAdoptedList((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      {/* Category filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/50 pb-6">
        <div className="flex gap-2.5">
          {["all", "dog", "cat"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${filter === type
                  ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
            >
              {type === "all" ? "View All" : `${type}s`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
          <Filter size={14} /> Showing {filteredPets.length} pets seeking homes
        </div>
      </div>

      {/* Grid: Pet Cards + Lost & Found alert card */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredPets.map((pet) => {
            const isFavorite = adoptedList.includes(pet.id);
            return (
              <motion.div
                key={pet.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard hover className="h-full border border-slate-200/60 bg-white p-6 flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-2xl shadow-inner">
                        {pet.icon}
                      </div>
                      <button
                        onClick={() => toggleAdopt(pet.id)}
                        className={`p-2 rounded-xl transition ${isFavorite ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                          }`}
                      >
                        <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <h4 className="text-lg font-bold text-slate-800">{pet.name}</h4>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">{pet.breed} • {pet.age}</p>
                    <p className="text-xs text-slate-500 leading-5 mt-3">{pet.desc}</p>
                  </div>

                  <div className="border-t border-slate-100 mt-5 pt-4 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Healthy & Vet Checked</span>
                    <Button variant="ghost" className="px-4 py-1.5 rounded-lg text-xs font-bold">
                      Adopt Me
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Lost & Found Community Alert Card */}
        <motion.div layout>
          <GlassCard hover={false} className="h-full border border-amber-100 bg-amber-50/15 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 text-lg shadow-inner">
                  <AlertTriangle size={20} />
                </div>
                <Badge variant="danger" className="text-[9px] px-2 py-0.5 font-bold uppercase">Active Alert</Badge>
              </div>

              <h4 className="text-lg font-bold text-slate-800">Lost & Found Hub</h4>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Community Alerts • Sector 4, Indiranagar</p>
              <p className="text-xs text-slate-500 leading-5 mt-3">
                <strong>Simba (Persian Cat)</strong> was reported missing. Last seen near central park. Help the owner locate him.
              </p>
            </div>

            <div className="border-t border-amber-100/50 mt-5 pt-4 flex gap-3">
              <Button className="flex-1 py-2 px-3 text-xs font-bold rounded-xl" variant="secondary">
                View Alerts
              </Button>
              <Button className="flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5" variant="primary">
                <MessageSquare size={12} /> Contact
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default AdoptionConsole;
