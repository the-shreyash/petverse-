import { motion } from "framer-motion";
import { useAuthHover } from "@/hooks/useAuthHover";

const SocialLoginButton = ({ provider = "google", onClick, children, ...props }) => {
  const { setIsHoveringButton } = useAuthHover();

  const providers = {
    google: {
      name: "Google",
      icon: "https://www.svgrepo.com/show/475656/google-color.svg",
    },
  };

  const activeProvider = providers[provider] || providers.google;

  return (
    <motion.button
      type="button"
      whileHover={{ y: -1, backgroundColor: "rgba(248, 250, 252, 0.8)", borderColor: "#10b981" }}
      whileTap={{ y: 0, scale: 0.99 }}
      onMouseEnter={() => setIsHoveringButton(true)}
      onMouseLeave={() => setIsHoveringButton(false)}
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        justify-center
        gap-3
        rounded-xl
        border
        border-gray-200
        bg-white
        py-3
        text-sm
        font-semibold
        text-slate-700
        shadow-sm
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-emerald-500/20
        cursor-pointer
      "
      {...props}
    >
      <img
        src={activeProvider.icon}
        alt={activeProvider.name}
        className="h-5 w-5"
      />
      <span>{children || `Continue with ${activeProvider.name}`}</span>
    </motion.button>
  );
};

export default SocialLoginButton;
