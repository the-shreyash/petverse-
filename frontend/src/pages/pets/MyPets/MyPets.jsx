import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import DashboardHeader from "@/pages/dashboard/DashboardHome/DashboardHeader";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, RefreshCw, PawPrint, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PetCard from "@/components/pets/cards/PetCard";
import { usePets } from "@/hooks/usePets";
import api from "@/services/api";

export default function MyPets() {
  const { pets, loading, refreshPets } = usePets();
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  const handleDeletePet = async (id) => {
    if (!window.confirm("Are you sure you want to remove this pet?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/pets/${id}`);
      await refreshPets();
    } catch (err) {
      console.error("Error deleting pet", err);
      alert("Failed to delete pet. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      (pet.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (pet.breed || "").toLowerCase().includes(search.toLowerCase());
    const matchesSpecies = speciesFilter === "All" || pet.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  return (
    <DashboardLayout
      pageTitle="My Pets"
      pageDescription="Manage all your lovely companions."
    >
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <DashboardHeader
            title="My Pets"
            subtitle="Manage your pets, monitor their health, and keep every record in one place."
          />

          <Link
            to="/pets/add"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 shrink-0"
          >
            <Plus size={18} />
            <span>Add Pet</span>
          </Link>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/95 p-6 shadow-sm md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute top-3.5 left-4 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search pets by name or breed..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white/50 focus:bg-white transition-all"
            />
          </div>

          {/* Species Dropdown */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none bg-white font-medium text-slate-700 focus:border-emerald-500"
            >
              <option value="All">All Species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Reptile">Reptile</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Pets Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-72 rounded-[24px] bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredPets.length > 0 ? (
              <motion.div
                layout
                className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              >
                {filteredPets.map((pet) => (
                  <motion.div
                    key={pet.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="relative group"
                  >
                    <PetCard pet={pet} />
                    {/* Delete overlay */}
                    <button
                      onClick={() => handleDeletePet(pet.id)}
                      disabled={deletingId === pet.id}
                      className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50 disabled:opacity-50"
                      title="Remove pet"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : pets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-dashed border-slate-200 p-16 text-center bg-white"
              >
                <PawPrint size={48} className="text-slate-200 mx-auto mb-4" />
                <h3 className="font-bold text-slate-700 text-xl mb-2">No pets yet</h3>
                <p className="text-slate-400 mb-6">Add your first pet to start tracking their health and care.</p>
                <Link
                  to="/pets/add"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg"
                >
                  <Plus size={16} />
                  Add First Pet
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-dashed border-slate-200 p-12 text-center bg-white/50"
              >
                <p className="text-slate-400 font-bold text-lg">No pets matched your filter.</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSpeciesFilter("All");
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700"
                >
                  <RefreshCw size={14} />
                  <span>Reset Filters</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </DashboardLayout>
  );
}