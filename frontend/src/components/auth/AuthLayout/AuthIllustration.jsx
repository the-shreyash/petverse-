import { motion } from "framer-motion";
import {
  Brain,
  CalendarCheck,
  Heart,
  ShoppingBag,
} from "lucide-react";

// Temporary images
// Replace these with your real assets later.
import dashboardPreview from "@/assets/illustrations/dashboard-preview.png";
import pawImage from "@/assets/illustrations/floating-paw.png";

const features = [
  {
    icon: Brain,
    title: "AI Care",
    color: "text-violet-500",
  },
  {
    icon: Heart,
    title: "Health",
    color: "text-rose-500",
  },
  {
    icon: ShoppingBag,
    title: "Shop",
    color: "text-cyan-500",
  },
  {
    icon: CalendarCheck,
    title: "Reminders",
    color: "text-emerald-500",
  },
];

const floating = {
  animate: {
    y: [0, -12, 0],
    transition: {
      repeat: Infinity,
      duration: 5,
      ease: "easeInOut",
    },
  },
};

const AuthIllustration = ({ isHovering = false }) => {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-12">

      {/* Dashboard Card */}
      <motion.div
        variants={floating}
        animate="animate"
        className="relative z-20 w-full max-w-xl"
      >
        <div className="overflow-hidden rounded-[32px] border border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl">
          <img
            src={dashboardPreview}
            alt="PetVerse Dashboard"
            className="w-full object-cover"
          />
        </div>
      </motion.div>

      {/* Paw */}
      <motion.img
        src={pawImage}
        alt=""
        animate={{
          rotate: [0, 8, -8, 0],
          y: [0, -12, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
        }}
        className="absolute top-20 left-12 w-16 opacity-70"
      />

      {/* Floating Feature Cards */}
      <div className="absolute inset-0">

        {features.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4 + index,
              }}
              className={`
                absolute
                rounded-2xl
                border
                border-white/40
                bg-white/70
                px-5
                py-3
                backdrop-blur-xl
                shadow-xl
                ${
                  index === 0
                    ? "left-6 top-24"
                    : index === 1
                    ? "right-8 top-28"
                    : index === 2
                    ? "left-12 bottom-32"
                    : "right-16 bottom-40"
                }
              `}
            >
              <div className="flex items-center gap-3">

                <div
                  className={`rounded-xl bg-slate-100 p-2 ${item.color}`}
                >
                  <Icon size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {item.title}
                  </p>

                  <p className="text-xs text-slate-500">
                    Active
                  </p>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

export default AuthIllustration;