import { motion } from "framer-motion";
import { features } from "../../data/features";
import FeatureFlipCard from "./FeaturesItem";

const FeatureGrid = () => {
  return (
    <div className="grid items-start gap-8 md:grid-cols-2">
      {features.map((feature, i) => (
        <motion.div
          key={feature.id}
          className={feature.large ? "md:col-span-2" : ""}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
        >
          <FeatureFlipCard {...feature} />
        </motion.div>
      ))}
    </div>
  );
};

export default FeatureGrid;
