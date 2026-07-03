import { motion } from "framer-motion";

const Display = ({
  children,
  className = "",
}) => {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: .8
      }}
      className={`
        text-5xl
        md:text-6xl
        lg:text-7xl
        xl:text-8xl
        font-extrabold
        leading-[1.05]
        tracking-tight
        text-gray-900
        ${className}
      `}
    >
      {children}
    </motion.h1>
  );
};

export default Display;