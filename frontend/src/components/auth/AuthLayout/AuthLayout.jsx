import { motion } from "framer-motion";
import AuthBackground from "./AuthBackground";
import AuthContent from "./AuthContent";
import AuthIllustration from "./AuthIllustration";
import AuthMascot from "../AuthMascot";
import { AuthHoverProvider } from "@/contexts/AuthHoverContext";

const AuthLayout = ({
  children,
  title,
  subtitle,
  showIllustration = true,
}) => {
  return (
    <AuthHoverProvider>
      <div className="relative min-h-screen overflow-hidden bg-slate-50">
        {/* Background */}
        <AuthBackground />

        <div className="relative z-10 flex min-h-screen">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2"
          >
            <AuthContent
              title={title}
              subtitle={subtitle}
            >
              {children}
            </AuthContent>
          </motion.div>

          {/* Right Side */}
          {showIllustration && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: "easeOut",
              }}
              className="hidden lg:flex lg:w-1/2"
            >
              <AuthIllustration />
            </motion.div>
          )}
        </div>

        <AuthMascot />
      </div>
    </AuthHoverProvider>
  );
};

export default AuthLayout;
