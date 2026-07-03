import { motion } from "framer-motion";

const GlassCard = ({
    children,
    className = "",
    hover = true
}) => {

    return (

        <motion.div

            whileHover={
                hover
                    ? {
                        y: -8,
                        scale: 1.02
                    }
                    : {}
            }

            transition={{
                duration: .3
            }}

            className={`
                relative
                overflow-hidden
                rounded-[30px]
                border
                border-white/40
                bg-white/70
                backdrop-blur-2xl
                shadow-[0_20px_60px_rgba(16,185,129,.10)]
                ${className}
            `}
        >

            {children}

        </motion.div>

    )

}

export default GlassCard;