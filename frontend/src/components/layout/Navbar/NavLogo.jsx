import logo from "../../../assets/logos/logo.png";
import { motion } from "framer-motion";

const NavLogo = () => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
        >
            <img
                src={logo}
                alt="PetVerse Logo"
                className="h-12 w-12 object-contain rounded-xl"
                fetchPriority="high"
            />
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-600">PetVerse</h1>
                <p className="-mt-1 text-xs text-gray-500">AI powered pet Care</p>
            </div>
        </motion.div>
    );
};

export default NavLogo;