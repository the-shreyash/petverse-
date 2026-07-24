import { motion } from "framer-motion";
import { NAV_LINKS } from "./navConfig";

const NavLinks = ({ activeId, onNavigate }) => {
  return (
    <ul className="hidden items-center gap-10 lg:flex">
      {NAV_LINKS.map((link) => {
        const isActive = activeId === link.target;

        return (
          <motion.li
            key={link.label}
            whileHover={{ y: -2 }}
            className="relative"
          >
            <button
              type="button"
              onClick={() => onNavigate(link.target)}
              className={[
                "cursor-pointer text-[15px] font-medium transition",
                isActive
                  ? "text-emerald-600"
                  : "text-gray-600 hover:text-emerald-600",
              ].join(" ")}
            >
              {link.label}
            </button>

            {isActive && (
              <motion.span
                layoutId="nav-active-underline"
                className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
