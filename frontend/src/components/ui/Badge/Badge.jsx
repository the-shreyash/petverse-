import { motion } from "framer-motion";

const Badge = ({
    children,
    variant = "primary",
    className = ""
}) => {

    const variants = {

        primary:
            "bg-emerald-100 text-emerald-700",

        secondary:
            "bg-slate-100 text-slate-700",

        success:
            "bg-green-100 text-green-700",

        warning:
            "bg-yellow-100 text-yellow-700",

        danger:
            "bg-red-100 text-red-700"

    }

    return (

        <motion.span

            whileHover={{
                scale:1.05
            }}

            className={`
            inline-flex
            items-center
            rounded-full
            px-4
            py-2
            text-sm
            font-semibold
            ${variants[variant]}
            ${className}
            `}

        >

            {children}

        </motion.span>

    )

}

export default Badge;