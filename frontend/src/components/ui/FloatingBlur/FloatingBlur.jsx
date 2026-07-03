import { motion } from "framer-motion";

const FloatingBlur = ({
    size = 350,
    color = "bg-emerald-300",
    top = "0px",
    left = "0px",
    right,
    bottom
}) => {

    return (

        <motion.div

            animate={{
                y: [0, -25, 0],
                x: [0, 20, 0]
            }}

            transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
            }}

            style={{
                width: size,
                height: size,
                top,
                left,
                right,
                bottom
            }}

            className={`
                absolute
                rounded-full
                blur-[120px]
                opacity-40
                ${color}
            `}
        />

    )

}

export default FloatingBlur