import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import GlassCard from "../../components/ui/GlassCard";

const FAQS = [
  {
    id: 1,
    question: "How accurate is the AI Breed Detection scanner?",
    answer: "Our computer vision models are trained on over 250,000 certified pet images across 250+ distinct breeds, achieving 90%+ classification accuracy. For the best results, upload a clear, well-lit close-up shot of your pet's face."
  },
  {
    id: 2,
    question: "Are the AI health recommendations safe for my pets?",
    answer: "Yes, all AI insights and preventative suggestions are verified against standard veterinary guidelines. However, our AI is an assistant designed to identify early wellness patterns and should not replace clinical vet diagnosis during emergencies."
  },
  {
    id: 3,
    question: "Can I manage multiple pet profiles under one account?",
    answer: "Absolutely! PetVerse makes it simple to manage multiple profiles. You can switch between cats, dogs, or other animals inside your dashboard, tracking their individual schedules, vaccinations, and metrics separately."
  },
  {
    id: 4,
    question: "How does the vet clinic scheduler directory work?",
    answer: "We sync in real-time with verified veterinary clinics in 25+ cities across India. You can browse open slots, select a convenient date/time, and book the slot instantly. Payments are handled directly at the clinic."
  }
];

const FAQAccordion = () => {
  const [activeId, setActiveId] = useState(null);

  const toggleAccordion = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {FAQS.map((faq) => {
        const isOpen = activeId === faq.id;
        return (
          <GlassCard
            key={faq.id}
            hover={false}
            className="border border-slate-200/50 bg-white shadow-sm overflow-hidden"
          >
            {/* Header / Button */}
            <button
              onClick={() => toggleAccordion(faq.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold text-slate-800 transition duration-300 hover:text-emerald-600"
            >
              <span className="text-sm md:text-base leading-6">{faq.question}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-lg p-1 shrink-0 ${isOpen ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}
              >
                <ChevronDown size={18} />
              </motion.div>
            </button>

            {/* Answer */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="border-t border-slate-100 bg-slate-50/30 px-6 py-5 text-xs md:text-sm leading-6 text-slate-500 font-medium">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
