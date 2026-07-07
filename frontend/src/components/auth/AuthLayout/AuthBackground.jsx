import { motion } from "framer-motion";

const floatingAnimation = {
  animate: {
    y: [0, -25, 0],
    x: [0, 15, 0],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const AuthBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-violet-50" />

      {/* Decorative Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #64748b 1px, transparent 1px),
            linear-gradient(to bottom, #64748b 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top Left Blob */}
      <motion.div
        variants={floatingAnimation}
        animate="animate"
        className="absolute -left-24 -top-20 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl"
      />

      {/* Bottom Right Blob */}
      <motion.div
        variants={floatingAnimation}
        animate="animate"
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-violet-300/30 blur-3xl"
      />

      {/* Center Glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/30 blur-[120px]"
      />

      {/* Floating Circles */}
      <motion.div
        animate={{
          y: [0, -18, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute left-[12%] top-[18%] h-5 w-5 rounded-full bg-sky-400/50"
      />

      <motion.div
        animate={{
          y: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute right-[20%] top-[30%] h-4 w-4 rounded-full bg-violet-400/50"
      />

      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
        className="absolute bottom-[18%] left-[30%] h-6 w-6 rounded-full bg-cyan-300/40"
      />

      {/* Radial Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(255,255,255,0.55))]" />
    </div>
  );
};

export default AuthBackground;