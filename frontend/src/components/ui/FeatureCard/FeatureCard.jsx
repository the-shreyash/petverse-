import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import GlassCard from "../GlassCard";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="group"
    >
      <GlassCard
        className="
          h-full
          p-8
          cursor-pointer
          transition-all
          duration-300
          border
          border-white/40
          hover:border-emerald-300
        "
      >
        {/* Icon */}
        <motion.div
          variants={{
            rest: {
              rotate: 0,
              scale: 1,
            },
            hover: {
              rotate: -10,
              scale: 1.1,
            },
          }}
          transition={{ duration: 0.3 }}
          className="
            mb-8
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-emerald-500
            to-teal-500
            text-white
            shadow-lg
          "
        >
          <Icon size={30} />
        </motion.div>

        {/* Title */}
        <h3 className="mb-4 text-2xl font-bold text-gray-900">
          {title}
        </h3>

        {/* Description */}
        <p className="mb-8 leading-8 text-gray-600">
          {description}
        </p>

        {/* Footer */}
        <motion.div
          variants={{
            rest: {
              x: 0,
            },
            hover: {
              x: 8,
            },
          }}
          className="
            flex
            items-center
            gap-2
            font-semibold
            text-emerald-600
          "
        >
          Learn More

          <ArrowRight size={18} />
        </motion.div>
      </GlassCard>
    </motion.div>
  );
};

export default FeatureCard;