import {
  ArrowRight,
  Bot,
  CalendarPlus,
  HeartPulse,
  Home,
  PawPrint,
  ShoppingBag,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const quickActions = [
  {
    id: "qa-1",
    title: "Add New Pet",
    description: "Enroll a new companion to PetVerse.",
    icon: "paw",
    path: "/pets/add",
  },
  {
    id: "qa-2",
    title: "Ask AI",
    description: "Get personalized insights and advice.",
    icon: "bot",
    path: "/ai",
  },
  {
    id: "qa-3",
    title: "Book Vet",
    description: "Schedule a clinic or video appointment.",
    icon: "calendar",
    path: "/health/appointments",
  },
  {
    id: "qa-4",
    title: "Shop Supplies",
    description: "Explore the marketplace for your pet.",
    icon: "shop",
    path: "/shop",
  },
  {
    id: "qa-5",
    title: "Community",
    description: "Connect with other pet parents.",
    icon: "home",
    path: "/community",
  },
];

const icons = {
  paw: PawPrint,
  calendar: CalendarPlus,
  bot: Bot,
  shop: ShoppingBag,
  heart: HeartPulse,
  home: Home,
};

const QuickActions = () => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      {/* Header */}

      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600">
          Quick Actions
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Get Things Done Faster
        </h2>

        <p className="mt-2 text-slate-500">
          Jump directly to the features you use the most.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = icons[action.icon];

          return (
            <motion.div
              key={action.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={action.path}
                className="
                  group
                  flex
                  h-full
                  flex-col
                  justify-between
                  rounded-3xl
                  border
                  border-slate-200
                  p-6
                  transition-all
                  hover:border-emerald-300
                  hover:shadow-lg
                "
              >
                <div>
                  <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-4 text-white">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-slate-500">
                    {action.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 font-medium text-emerald-600 transition-all group-hover:gap-3">
                  Open

                  <ArrowRight size={18} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;