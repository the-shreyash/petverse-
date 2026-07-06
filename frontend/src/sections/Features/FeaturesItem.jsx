import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import GlassCard from "../../components/ui/GlassCard";

const FeatureItem = ({
  icon: Icon,
  title,
  description,
  large = false,
}) => {
  return (
    <motion.div
      className={large ? "md:col-span-2" : ""}
      whileHover={{
        y: -10,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <GlassCard
        className={`
          group
          h-full
          p-8
          cursor-pointer
          transition-all
          duration-300
          hover:border-emerald-300
        `}
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">

          <Icon size={30} />

        </div>

        <h3 className="mb-4 text-2xl font-bold">

          {title}

        </h3>

        <p className="leading-8 text-gray-600">

          {description}

        </p>

        <div className="mt-8 flex items-center gap-2 text-emerald-600 font-semibold">

          Learn More

          <ArrowRight
            size={18}
            className="transition group-hover:translate-x-2"
          />

        </div>

      </GlassCard>
    </motion.div>
  );
};

export default FeatureItem;