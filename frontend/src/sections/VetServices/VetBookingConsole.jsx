import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Calendar, Clock, Check, AlertCircle } from "lucide-react";
import GlassCard from "../../components/ui/GlassCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const CLINICS = [
  {
    id: "greenfield",
    name: "Greenfield Animal Hospital",
    distance: "1.2 km away",
    rating: 4.9,
    reviews: 142,
    fee: "₹500",
    slots: ["09:30 AM", "11:30 AM", "03:00 PM", "04:30 PM"]
  },
  {
    id: "paws_claws",
    name: "Paws & Claws Veterinary Clinic",
    distance: "2.8 km away",
    rating: 4.7,
    reviews: 89,
    fee: "₹400",
    slots: ["10:00 AM", "01:00 PM", "03:30 PM", "05:00 PM"]
  },
  {
    id: "metro_vet",
    name: "Metro Vet & Emergency Center",
    distance: "4.5 km away",
    rating: 4.8,
    reviews: 215,
    fee: "₹600",
    slots: ["08:30 AM", "10:30 AM", "02:00 PM", "04:00 PM"]
  }
];

const VetBookingConsole = () => {
  const [selectedClinicId, setSelectedClinicId] = useState("greenfield");
  const [selectedDate, setSelectedDate] = useState("July 7");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingStatus, setBookingStatus] = useState("idle"); // idle, success

  const clinic = CLINICS.find((c) => c.id === selectedClinicId);

  const handleBook = () => {
    if (!selectedSlot) return;
    setBookingStatus("success");
  };

  const handleReset = () => {
    setBookingStatus("idle");
    setSelectedSlot("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Left Column: Clinic List */}
      <div className="space-y-4 lg:col-span-2">
        <h4 className="text-lg font-bold text-slate-800 mb-2">Available Clinics Nearby</h4>
        <div className="flex flex-col gap-3">
          {CLINICS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedClinicId(c.id);
                setSelectedSlot("");
                setBookingStatus("idle");
              }}
              className={`flex items-start gap-4 rounded-2xl border p-4 text-left font-semibold transition-all duration-300 ${selectedClinicId === c.id
                  ? "border-emerald-500 bg-emerald-50/50 text-emerald-800 shadow-md scale-[1.01]"
                  : "border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50/50"
                }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 text-lg shadow-inner shrink-0">
                <MapPin size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-slate-800 truncate">{c.name}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-0.5 text-amber-500">
                    <Star size={12} fill="currentColor" /> {c.rating}
                  </span>
                  <span>({c.reviews} reviews)</span>
                  <span>•</span>
                  <span>{c.distance}</span>
                </div>
                <p className="text-xs text-emerald-600 font-bold mt-2">Consultation: {c.fee}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Mini Calendar & Slot Scheduler */}
      <div className="lg:col-span-3">
        <GlassCard hover={false} className="flex min-h-[400px] flex-col border border-slate-200/60 bg-white/95 p-6 md:p-8 shadow-xl">
          <AnimatePresence mode="wait">
            {bookingStatus === "idle" ? (
              <motion.div
                key="booking-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Schedule Appointment</h4>
                  <p className="text-xs text-slate-400 mb-6">Select a convenient date and time for {clinic.name}.</p>

                  {/* Date Selector */}
                  <div className="mb-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Select Date</p>
                    <div className="flex gap-3">
                      {["July 7", "July 8", "July 9"].map((d) => (
                        <button
                          key={d}
                          onClick={() => setSelectedDate(d)}
                          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all border ${selectedDate === d
                              ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                              : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
                            }`}
                        >
                          <Calendar size={12} /> {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slots Selector */}
                  <div className="mb-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Available Slots</p>
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                      {clinic.slots.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSlot(s)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all border ${selectedSlot === s
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                              : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
                            }`}
                        >
                          <Clock size={12} /> {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Booking Trigger Buttons */}
                <div className="border-t border-slate-100 pt-5 flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 leading-5 flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-slate-400 shrink-0" />
                    No prepayment required. Pay at the clinic.
                  </div>
                  <Button
                    onClick={handleBook}
                    disabled={!selectedSlot}
                    className={`py-2.5 px-6 text-xs font-bold rounded-xl ${!selectedSlot ? "opacity-50 cursor-not-allowed" : ""}`}
                    variant="primary"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="booking-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-8"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-inner">
                  <Check size={32} strokeWidth={3} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Appointment Scheduled!</h4>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
                  Your appointment at <strong>{clinic.name}</strong> has been successfully booked for <strong>{selectedDate} at {selectedSlot}</strong>.
                </p>
                <div className="flex gap-4">
                  <Button onClick={handleReset} variant="secondary" className="py-2 px-5 text-xs font-bold rounded-xl">
                    Book Another Slot
                  </Button>
                  <Button variant="primary" className="py-2 px-5 text-xs font-bold rounded-xl">
                    Add to Calendar
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </div>
  );
};

export default VetBookingConsole;
