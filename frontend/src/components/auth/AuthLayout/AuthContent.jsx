import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import NavLogo from "@/components/layout/Navbar/NavLogo";
import { authTheme } from "@/styles/authTheme";

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
        className="mb-10"
      >
        <NavLogo />
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
        className={authTheme.card}
      >
        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>

          <p className="mt-2 leading-7 text-gray-600">
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
          className="font-medium text-emerald-600 hover:text-teal-600"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy"
          className="font-medium text-emerald-600 hover:text-teal-600"
        >
          Privacy Policy
        </Link>
        .
      </motion.div>
    </div>
  );
};

export default AuthContent;
