import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

const BlurText = ({
    text,
    className = "",
    delay = 0,
    animateBy = "words", // 'words' or 'letters'
    direction = "bottom",
}) => {
    const elements = animateBy === "words" ? text.split(" ") : text.split("");
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.1 });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: delay / 1000,
            },
        },
    };

    const itemVariants = {
        hidden: {
            filter: "blur(10px)",
            opacity: 0,
            y: direction === "bottom" ? 50 : direction === "top" ? -50 : 0,
        },
        visible: {
            filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
            opacity: [0, 0.5, 1],
            y: [direction === "bottom" ? 50 : -50, -5, 0],
            transition: {
                duration: 0.35,
                ease: "easeOut",
            },
        },
    };

    return (
        <motion.div
            ref={containerRef}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className={`flex flex-wrap ${className}`}
        >
            {elements.map((element, index) => (
                <motion.span
                    key={index}
                    variants={itemVariants}
                    className="inline-block"
                >
                    {element === " " ? "\u00A0" : element}
                    {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default BlurText;
