import { motion } from "framer-motion";

const links = [
  "Home",
  "Features",
  "AI Care",
  "Shop",
  "Adoption",
];

const NavLinks = () => {
  return (
    <ul className="hidden items-center gap-10 lg:flex">
      {links.map((link) => (
        <motion.li
          key={link}
          whileHover={{ y: -2 }}
          className="cursor-pointer text-[15px] font-medium text-gray-600 transition hover:text-emerald-600"
        >
          {link}
        </motion.li>
      ))}
    </ul>
  );
};

export default NavLinks;