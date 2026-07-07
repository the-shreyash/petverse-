import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import petsVideo from "@/assets/video/like_i_want_an_live_video_of_t.mp4";

const AuthMascot = () => {
  const [show, setShow] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Motion values to track cursor X/Y coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tracking coordinates (3D tilt & offset)
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [0, window.innerHeight], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, window.innerWidth], [-8, 8]), springConfig);
  const translateX = useSpring(useTransform(mouseX, [0, window.innerWidth], [-15, 15]), springConfig);
  const translateY = useSpring(useTransform(mouseY, [0, window.innerHeight], [-10, 10]), springConfig);

  useEffect(() => {
    // 1. Entrance Pop-up slide up after 1 second delay
    const timer = setTimeout(() => {
      setShow(true);

      // 2. Play sound with browser autoplay restriction handling
      if (audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            console.log("Audio autoplay restricted. Unlocking audio listener on first interaction.");

            const unlockAudio = () => {
              if (audioRef.current) {
                audioRef.current.play().catch(() => {});
              }
              document.removeEventListener("click", unlockAudio);
              document.removeEventListener("keydown", unlockAudio);
            };

            document.addEventListener("click", unlockAudio);
            document.addEventListener("keydown", unlockAudio);
          });
        }
      }
    }, 1000);

    // 3. Capture cursor movement
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      initial={{ y: "110%", opacity: 0 }}
      animate={show ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
      transition={{
        y: { type: "spring", stiffness: 100, damping: 15 },
        opacity: { duration: 0.4 }
      }}
      style={{
        rotateX,
        rotateY,
        x: translateX,
        y: translateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="
        fixed
        bottom-0
        right-5
        z-[9999]
        pointer-events-none
        w-[220px]
        md:w-[280px]
        h-auto
        select-none
      "
    >
      <video
        ref={videoRef}
        src={petsVideo}
        autoPlay
        loop
        muted
        playsInline
        className="
          w-full
          h-auto
          object-contain
          mix-blend-multiply
          pointer-events-auto
        "
      />
      <audio
        ref={audioRef}
        src="/bark-meow.mp3"
        preload="auto"
      />
    </motion.div>
  );
};

export default AuthMascot;
