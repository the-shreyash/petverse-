import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import GlassCard from "../../components/ui/GlassCard";

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    role: "Parent of Casper (Golden Retriever)",
    rating: 5,
    comment: "The AI Care Assistant is incredible. Casper had a mild skin irritation, and the AI correctly identified the potential trigger and recommended a soothing wash that cleared it in 2 days. Saved us so much panic!",
    avatar: "👩"
  },
  {
    name: "Rahul Mehta",
    role: "Parent of Simba (Persian Cat)",
    rating: 5,
    comment: "Finding local vet care used to be extremely stressful. With PetVerse, I booked a vaccine slot at a highly-rated clinic nearby in less than a minute. The scheduling dashboard is incredibly seamless.",
    avatar: "👨"
  },
  {
    name: "Sneha Nair",
    role: "Parent of Milo (Beagle)",
    rating: 5,
    comment: "I used the AI Breed Scanner out of pure curiosity, and it correctly identified my pup's mixed beagle genes instantly. The tailored health tips for his energy levels have been extremely helpful.",
    avatar: "👩‍🦰"
  }
];

const TestimonialGrid = () => {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {TESTIMONIALS.map((t, idx) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
        >
          <GlassCard className="h-full border border-slate-200/50 bg-white p-8 flex flex-col justify-between">
            <div>
              {/* Quote Mark Decoration */}
              <div className="text-emerald-500 mb-6 opacity-30">
                <Quote size={32} fill="currentColor" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="#FACC15" color="#FACC15" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm leading-7 text-slate-600 mb-8 font-medium italic">
                "{t.comment}"
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3.5 border-t border-slate-100 pt-5">
              <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg shadow-inner">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{t.name}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{t.role}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};

export default TestimonialGrid;
