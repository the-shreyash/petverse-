import { motion } from "framer-motion";
import { useAuthHover } from "@/contexts/AuthHoverContext";

const AuthButton = ({ children, isLoading, className = "", ...props }) => {
  const { setIsHoveringButton } = useAuthHover();

  return (
    <motion.button
      whileHover={{ y: -1, shadow: "0 10px 20px -10px rgba(6, 182, 212, 0.4)" }}
      whileTap={{ y: 0, scale: 0.98 }}
      onMouseEnter={() => setIsHoveringButton(true)}
      onMouseLeave={() => setIsHoveringButton(false)}
      className={`
        w-full
        rounded-2xl
        bg-gradient-to-r
        from-cyan-500
        to-blue-600
        py-3.5
        font-semibold
        text-white
        transition-all
        duration-200
        disabled:opacity-50
        disabled:pointer-events-none
        flex items-center justify-center gap-2
        cursor-pointer
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        children
      )}
    </motion.button>
  );
};

export default AuthButton;
