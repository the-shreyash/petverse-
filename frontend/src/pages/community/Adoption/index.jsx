import React, { useState } from "react";
import { Sparkles, Search, Heart, Plus, MapPin, DollarSign, PawPrint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdoption } from "@/hooks/useAdoption";
import { usePets } from "@/hooks/usePets";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8000";

function getImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${BACKEND_URL}${url}`;
}

function ListingCard({ listing, onInterested }) {
  const [interested, setInterested] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[20px] border border-slate-200/70 bg-white shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
        {listing.gallery?.[0] ? (
          <img
            src={getImageUrl(listing.gallery[0])}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <PawPrint size={48} className="text-emerald-300" />
        )}
        {listing.adoption_fee !== null && listing.adoption_fee !== undefined && (
          <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold rounded-full px-2 py-1 flex items-center gap-1">
            <DollarSign size={10} />
            {listing.adoption_fee === 0 ? "Free" : `$${listing.adoption_fee}`}
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-slate-800 text-base leading-tight">{listing.title}</h3>
          {(listing.city || listing.state) && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin size={10} />
              {[listing.city, listing.state, listing.country].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        {listing.description && (
          <p className="text-xs text-slate-500 line-clamp-2">{listing.description}</p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => {
              setInterested(!interested);
              if (!interested && onInterested) onInterested(listing.id);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              interested
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            {interested ? "✓ Interested" : "I'm Interested"}
          </button>
          <Link
            to={`/adoption/${listing.id}`}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-center border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function CreateListingModal({ userPets, onClose, onSubmit }) {
  const [selectedPetId, setSelectedPetId] = useState("");
  const [reason, setReason] = useState("");
  const [fee, setFee] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedPet = userPets.find(p => p.id === selectedPetId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPetId) return;
    setSubmitting(true);
    try {
      await onSubmit({
        pet_id: selectedPetId,
        title: `${selectedPet?.name || "Pet"} for Adoption`,
        description: reason,
        adoption_fee: parseFloat(fee) || 0,
        city,
        state,
        gallery: []
      });
      onClose();
    } catch (err) {
      alert("Failed to create listing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[24px] p-8 max-w-lg w-full mx-4 shadow-2xl"
      >
        <h2 className="text-xl font-black text-slate-800 mb-6">Create Adoption Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Select Pet *</label>
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Choose a pet...</option>
              {userPets.map(pet => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species} · {pet.breed || "Mixed"})
                </option>
              ))}
            </select>
          </div>

          {selectedPet && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-700 font-medium">
              ✓ Auto-populated: {selectedPet.name}, {selectedPet.species}, {selectedPet.gender || "Unknown gender"}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Reason / Description *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={3}
              placeholder="Why are you listing this pet for adoption?"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New York"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">State</label>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. NY"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Adoption Fee ($)</label>
            <input
              type="number"
              min="0"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="0 for free"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedPetId}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-sm font-bold text-white hover:bg-emerald-600 transition disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdoptionPageContent() {
  const { adoptablePets, loading, addPetForAdoption, submitApplication } = useAdoption();
  const { pets: userPets } = usePets();
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredPets = adoptablePets.filter((listing) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (listing.title || "").toLowerCase().includes(q) ||
      (listing.city || "").toLowerCase().includes(q) ||
      (listing.state || "").toLowerCase().includes(q) ||
      (listing.description || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-10 text-white shadow-2xl"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative max-w-2xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur mb-4 shadow-lg">
            <Heart size={24} fill="currentColor" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Pet Adoption</h2>
          <p className="mt-2 text-white/80 font-semibold text-sm md:text-base">
            Browse pets needing forever homes. Every pet on this list is from a real user.
          </p>
        </div>
      </motion.div>

      {/* Search + Create */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by location, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </div>
        {userPets.length > 0 && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all"
          >
            <Plus size={16} />
            List a Pet
          </button>
        )}
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 rounded-[20px] bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filteredPets.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPets.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onInterested={(id) => submitApplication(id, {})}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-16 text-center">
          <PawPrint size={48} className="text-slate-200 mx-auto mb-4" />
          <h3 className="font-bold text-slate-600 text-lg">No adoption listings yet</h3>
          <p className="text-sm text-slate-400 mt-1">
            {userPets.length > 0
              ? "Be the first to list a pet. Click \"List a Pet\" above."
              : "Add a pet to your profile first, then you can create adoption listings."}
          </p>
          {userPets.length === 0 && (
            <Link
              to="/pets/add"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 transition"
            >
              <Plus size={14} />
              Add Your First Pet
            </Link>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <CreateListingModal
            userPets={userPets}
            onClose={() => setShowModal(false)}
            onSubmit={addPetForAdoption}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
