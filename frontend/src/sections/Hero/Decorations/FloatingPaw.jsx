import { motion } from "framer-motion";
import paw from "../../../assets/illustrations/paw.png"

const FloatingPaw = ({ className }) => {
  return (
    <motion.img
      src={paw}
      alt=""
      animate={{
        y: [0, -12, 0],
        rotate: [0, 8, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute opacity-70 ${className}`}
    />
  );
};

export default FloatingPaw;