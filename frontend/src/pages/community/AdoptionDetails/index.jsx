import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, FileText, CheckCircle, MapPin, PawPrint, User as UserIcon, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import GlassCard from "@/components/ui/GlassCard/GlassCard";
import { useAdoption } from "@/hooks/useAdoption";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8000";

function getImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${BACKEND_URL}${url}`;
}

export default function AdoptionDetailsPage() {
  const { id } = useParams();
  const { fetchListingDetail, submitApplication } = useAdoption();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [homeType, setHomeType] = useState("Apartment");
  const [hasKids, setHasKids] = useState("No");
  const [activityLevel, setActivityLevel] = useState("Moderate");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await fetchListingDetail(id);
        if (active) setListing(data);
      } catch (err) {
        console.error("Failed to load adoption listing", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, fetchListingDetail]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      await submitApplication(listing.id, { homeType, hasKids, activityLevel, message });
    } catch (err) {
      // notification/interest still recorded server-side where possible
    }
    setSubmitted(true);
    setTimeout(() => {
      setIsApplyModalOpen(false);
      setSubmitted(false);
      setCurrentStep(1);
    }, 2000);
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Adoption Details">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[500px] rounded-[24px] bg-slate-100 animate-pulse" />
          <div className="h-[300px] rounded-[24px] bg-slate-100 animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !listing) {
    return (
      <DashboardLayout pageTitle="Adoption Details">
        <div className="text-center py-16">
          <PawPrint size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Adoption listing not found.</p>
          <Link to="/adoption" className="text-emerald-500 font-bold mt-2 inline-block">
            Back to listings
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const pet = listing.pet || {};
  const owner = listing.owner || {};
  const petName = pet.name || listing.title || "This Pet";

  // Combined gallery: pet's uploaded photos + listing gallery + pet profile image
  const images = [
    pet.profile_image,
    ...(pet.gallery || []),
    ...(listing.gallery || [])
  ]
    .filter(Boolean)
    .map(getImageUrl);

  const characteristics = [
    pet.breed && { label: pet.breed },
    pet.species && { label: pet.species },
    pet.age && { label: pet.age },
    pet.gender && { label: pet.gender, tone: "rose" },
    pet.weight != null && { label: `${pet.weight} kg` }
  ].filter(Boolean);

  const feeLabel =
    listing.adoption_fee === 0 || listing.adoption_fee == null
      ? "Free"
      : `$${listing.adoption_fee}`;

  const locationLabel = [listing.city, listing.state, listing.country]
    .filter(Boolean)
    .join(", ");

  const isPending = listing.status === "PENDING" || listing.status === "Pending";
  const isAdopted = listing.status === "ADOPTED" || listing.status === "Adopted";

  return (
    <DashboardLayout pageTitle={`Meet ${petName}`} pageDescription={`Learn about ${petName} and apply to adopt.`}>
      <div className="space-y-6 text-left">
        <Link
          to="/adoption"
          className="flex items-center gap-2 font-bold text-slate-800 text-sm hover:text-emerald-600 transition"
        >
          <ArrowLeft size={16} />
          Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6 md:p-8" hover={false}>
              {/* Gallery */}
              <div className="grid grid-cols-2 gap-4 h-[350px] overflow-hidden rounded-[24px]">
                {images[0] ? (
                  <img src={images[0]} alt={petName} className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <PawPrint size={56} className="text-emerald-300" />
                  </div>
                )}
                {images[1] ? (
                  <img src={images[1]} alt={petName} className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">
                    No Additional Photos
                  </div>
                )}
              </div>

              {/* Title & characteristics */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-black text-slate-800">{petName}</h3>
                  {owner.name && (
                    <p className="text-xs text-slate-400 font-bold mt-1">Listed by {owner.name}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {characteristics.map((c, i) => (
                    <span
                      key={i}
                      className={`text-xs font-black px-3.5 py-1.5 rounded-xl ${
                        c.tone === "rose" ? "text-rose-500 bg-rose-50" : "text-slate-500 bg-slate-100"
                      }`}
                    >
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Story */}
              <div className="mt-8 space-y-4">
                <h4 className="font-bold text-slate-800 text-lg">Story</h4>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
                  {listing.description || "No description provided."}
                </p>
                {pet.description && (
                  <p className="text-sm text-slate-500 leading-relaxed">{pet.description}</p>
                )}
              </div>

              {/* Pet profile facts */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4">
                  <FileText size={18} className="text-emerald-500" />
                  Pet Profile
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Fact label="Species" value={pet.species} />
                  <Fact label="Breed" value={pet.breed} />
                  <Fact label="Age" value={pet.age} />
                  <Fact label="Gender" value={pet.gender} />
                  <Fact label="Weight" value={pet.weight != null ? `${pet.weight} kg` : null} />
                  <Fact label="Color" value={pet.color} />
                  <Fact label="Spayed / Neutered" value={pet.sterilized ? "Yes" : "No"} />
                  <Fact label="Blood Group" value={pet.blood_group} />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key info */}
            <GlassCard className="p-6" hover={false}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <DollarSign size={13} /> Adoption Fee
                  </span>
                  <span className="text-sm font-black text-emerald-600">{feeLabel}</span>
                </div>
                {locationLabel && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <MapPin size={13} /> Location
                    </span>
                    <span className="text-sm font-bold text-slate-700">{locationLabel}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Status</span>
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                      isAdopted
                        ? "bg-slate-100 text-slate-500"
                        : isPending
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {listing.status || "AVAILABLE"}
                  </span>
                </div>
                {owner.name && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <UserIcon size={13} /> Owner
                    </span>
                    <span className="text-sm font-bold text-slate-700">{owner.name}</span>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Application widget */}
            <GlassCard className="p-6" hover={false}>
              <h4 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
                <Heart size={16} className="text-rose-500" /> Adoption Inquiry
              </h4>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed mb-6">
                Submit an application to express interest in adopting {petName}. The owner will be notified.
              </p>

              {isAdopted ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs font-bold text-slate-500">
                  This pet has already been adopted.
                </div>
              ) : isPending ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-xs font-bold text-amber-600">
                  An adoption application is currently pending review.
                </div>
              ) : (
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm py-3.5 shadow-lg shadow-emerald-100 hover:opacity-95 transition outline-none"
                >
                  Apply to Adopt {petName}
                </button>
              )}
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[30px] p-8 max-w-md w-full border border-slate-100 shadow-2xl relative"
          >
            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle size={30} />
                </div>
                <h4 className="text-lg font-bold text-slate-800">Application Submitted!</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  The owner has been notified of your interest. You will hear back soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-6">
                <div className="text-left border-b border-slate-100 pb-3 flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-lg">Adoption Request</h4>
                  <span className="text-xs text-slate-400 font-bold">Step {currentStep} of 2</span>
                </div>

                {currentStep === 1 ? (
                  <div className="space-y-4 text-left">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Living Environment</label>
                      <select
                        value={homeType}
                        onChange={(e) => setHomeType(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm mt-1.5 focus:border-emerald-400 focus:bg-white outline-none"
                      >
                        <option value="House with Yard">House with fenced yard</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Townhouse">Townhouse</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Children in Household?</label>
                      <select
                        value={hasKids}
                        onChange={(e) => setHasKids(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm mt-1.5 focus:border-emerald-400 focus:bg-white outline-none"
                      >
                        <option value="No">No children under 12</option>
                        <option value="Yes">Yes, children under 12</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-full rounded-xl bg-slate-800 text-white font-bold text-xs py-3 mt-4 hover:bg-slate-700 transition"
                    >
                      Next Step
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 text-left">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Your Activity Level</label>
                      <select
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm mt-1.5 focus:border-emerald-400 focus:bg-white outline-none"
                      >
                        <option value="High">High (Daily running/hiking)</option>
                        <option value="Moderate">Moderate (Daily walking/play)</option>
                        <option value="Low">Low (Short walks/cuddles)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Introduce Yourself</label>
                      <textarea
                        rows={3}
                        placeholder="Tell the owner about your experience with pets..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm mt-1.5 focus:border-emerald-400 focus:bg-white outline-none resize-none"
                      />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 transition"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs py-3 hover:opacity-95 transition"
                      >
                        Submit Request
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}

function Fact({ label, value }) {
  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
      <p className="text-xs text-slate-400 font-bold">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-1">{value ?? "—"}</p>
    </div>
  );
}
