import { motion } from "framer-motion";
import { useAuthHover } from "@/contexts/AuthHoverContext";

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
      whileHover={{ y: -1, backgroundColor: "rgba(248, 250, 252, 0.8)", borderColor: "#22d3ee" }}
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
        rounded-2xl
        border
        border-slate-200/80
        bg-white/80
        py-3
        text-sm
        font-semibold
        text-slate-700
        shadow-sm
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-500/20
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
