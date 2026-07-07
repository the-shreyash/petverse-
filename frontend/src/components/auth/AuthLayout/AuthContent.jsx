import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { motion } from "framer-motion";

const AuthContent = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-10 flex items-center gap-3"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-300/40">
          <PawPrint size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            PetVerse
          </h1>

          <p className="text-sm text-slate-500">
            One Platform. Complete Pet Care.
          </p>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.55,
        }}
        className="
          rounded-3xl
          border
          border-white/40
          bg-white/70
          p-8
          shadow-2xl
          shadow-slate-200/50
          backdrop-blur-xl
        "
      >
        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>

          <p className="mt-2 text-slate-500">
            {subtitle}
          </p>
        </div>

        {/* Dynamic Form */}
        <div>
          {children}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.35,
        }}
        className="mt-8 text-center text-sm text-slate-500"
      >
        By continuing you agree to our{" "}
        <Link
          to="/terms"
          className="font-medium text-cyan-600 hover:text-cyan-700"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy"
          className="font-medium text-cyan-600 hover:text-cyan-700"
        >
          Privacy Policy
        </Link>
        .
      </motion.div>
    </div>
  );
};

export default AuthContent;