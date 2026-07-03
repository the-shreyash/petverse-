import { motion } from "framer-motion"

const Button = ({
    children,
    variant = "primary",
    className = "",
    ...props
}) => {
    const styles = {
        primary:
            "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg",

        secondary:
            "bg-white border border-gray-200 text-gray-800",

        ghost:
            "bg-transparent text-gray-700"
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`px-7 py-3.5 rounded-xl font-semibold transition-all duration-300 ${styles[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    )
}

export default Button