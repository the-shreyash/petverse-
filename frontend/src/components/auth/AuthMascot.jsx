import { AnimatePresence, motion } from "framer-motion";
import puppyCatImage from "@/assets/illustrations/puppy&cat.png";
import { useAuthHover } from "@/hooks/useAuthHover";

const AuthMascot = () => {
  const { isHoveringButton } = useAuthHover();

  return (
    <AnimatePresence>
      {isHoveringButton && (
        <motion.div
          initial={{
            opacity: 0,
            y: 90,
            scale: 0.86,
            rotate: -3,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
          }}
          exit={{
            opacity: 0,
            y: 80,
            scale: 0.9,
            rotate: 2,
          }}
          transition={{
            type: "spring",
            stiffness: 190,
            damping: 22,
            mass: 0.9,
          }}
          className="
            pointer-events-none
            fixed
            bottom-0
            right-5
            z-[9999]
            h-auto
            w-[210px]
            select-none
            md:w-[270px]
          "
        >
          <img
            src={puppyCatImage}
            alt=""
            className="h-auto w-full object-contain drop-shadow-[0_24px_40px_rgba(16,185,129,.20)]"
            draggable="false"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthMascot;
