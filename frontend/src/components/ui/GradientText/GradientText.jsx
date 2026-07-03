const GradientText = ({
    children,
    className = ""
}) => {

    return (

        <span
            className={`
                bg-gradient-to-r
                from-emerald-500
                via-teal-500
                to-cyan-500
                bg-clip-text
                text-transparent
                ${className}
            `}
        >

            {children}

        </span>

    )

}

export default GradientText