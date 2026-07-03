import { motion } from "framer-motion";
import dog from "../../assets/illustrations/dog-cat.png";

const HeroImage = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: .9
      }}
      animate={{
        opacity: 1,
        scale: 1
      }}
      transition={{
        duration: 1
      }}
      className="relative z-10"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-emerald-200 blur-[100px] opacity-40" />

      <motion.img
        animate={{
          y: [0, -12, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        src={dog}
        alt="PetVerse Hero"
        className="relative z-10 w-[3000px] h-[600px]"
      />
    </motion.div>
  );
};

export default HeroImage;