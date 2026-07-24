import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronUp, Check } from "lucide-react";
import Button from "../../components/ui/Button";

/**
 * FeatureCard
 *
 * A content-driven feature card. It has NO fixed height — the card sizes
 * naturally to its content and stays compact while collapsed. Pressing
 * "Learn More" expands an in-place details panel (How It Works + Benefits);
 * Framer Motion `layout` animations smoothly grow/shrink the card so there
 * is never leftover white space in either state.
 *
 * Renders entirely from a feature object (see src/data/features.js).
 */
const FeatureCard = ({
  icon: Icon,
  title,
  shortDescription,
  howItWorks = [],
  benefits = [],
  route = "/",
}) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const toggle = () => setExpanded((v) => !v);
  const getStarted = () => navigate(route);

  const ease = [0.22, 1, 0.36, 1];

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.5, ease } }}
      className="flex flex-col rounded-[30px] border border-white/40 bg-white/70 p-8 shadow-[0_20px_60px_rgba(16,185,129,.10)] backdrop-blur-2xl"
    >
      <motion.div
        layout="position"
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg"
      >
        <Icon size={30} />
      </motion.div>

      <motion.h3
        layout="position"
        className="mb-4 text-2xl font-bold text-gray-900"
      >
        {title}
      </motion.h3>

      <motion.p layout="position" className="leading-8 text-gray-600">
        {shortDescription}
      </motion.p>

      {/* ---------------- EXPANDABLE DETAILS ---------------- */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="details"
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease }}
            className="overflow-hidden"
          >
            <div className="pt-8">
              {/* How It Works */}
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-600">
                How It Works
              </p>
              <ol className="mb-6 space-y-2.5">
                {howItWorks.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-6 text-gray-700">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>

              {/* Benefits */}
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-600">
                Benefits
              </p>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <Check
                      size={16}
                      className="flex-shrink-0 text-emerald-500"
                    />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- ACTIONS ---------------- */}
      <motion.div
        layout="position"
        className="flex flex-wrap items-center gap-3 pt-8"
      >
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="group inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3 font-semibold text-emerald-600 transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-50"
        >
          {expanded ? "Show Less" : "Learn More"}
          {expanded ? (
            <ChevronUp size={18} />
          ) : (
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          )}
        </button>

        <Button onClick={getStarted}>Get Started</Button>
      </motion.div>
    </motion.div>
  );
};

export default FeatureCard;
