import { useEffect, useState } from "react";

const useMouseParallax = (strength = 25) => {

    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    useEffect(() => {

        const handleMouseMove = (e) => {

            const x =
                (e.clientX / window.innerWidth - 0.5) * strength;

            const y =
                (e.clientY / window.innerHeight - 0.5) * strength;

            setPosition({ x, y });

        };

        window.addEventListener("mousemove", handleMouseMove);

        return () =>
            window.removeEventListener(
                "mousemove",
                handleMouseMove
            );

    }, [strength]);

    return position;

};

export default useMouseParallax;