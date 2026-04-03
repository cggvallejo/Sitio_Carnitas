import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import porkbotImg from '../assets/images/porkbot.png';
import { MousePointer2 } from 'lucide-react';

const PorkbotCursorThief = () => {
    const [isIdle, setIsIdle] = useState(false);
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [isStealing, setIsStealing] = useState(false);

    // 1 minuto = 60000ms
    const IDLE_TIMEOUT = 60000;

    useEffect(() => {
        let timeoutId;

        const handleMouseMove = () => {
            // Si estaba inactivo y se movió el mouse, recuperar el control
            if (isIdle) {
                setIsIdle(false);
                setIsStealing(false);
                document.body.style.cursor = 'auto'; // Restaurar cursor
            }

            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsIdle(true);
                setIsStealing(true);
                document.body.style.cursor = 'none';
            }, IDLE_TIMEOUT);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchstart', handleMouseMove);

        timeoutId = setTimeout(() => {
            setIsIdle(true);
            setIsStealing(true);
            document.body.style.cursor = 'none';
        }, IDLE_TIMEOUT);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchstart', handleMouseMove);
            clearTimeout(timeoutId);
            document.body.style.cursor = 'auto';
        };
    }, [isIdle]);

    if (!isStealing) return null;

    return (
        <AnimatePresence>
            {isStealing && (
                <motion.div
                    // El chanchito viene de abajo, roba el cursor y se va corriendo hacia la derecha
                    initial={{
                        opacity: 1,
                        x: -150,
                        y: mousePos.y
                    }}
                    animate={{
                        opacity: [1, 1, 1, 1],
                        x: [-150, mousePos.x - 40, mousePos.x - 40, window.innerWidth + 200],
                        y: [mousePos.y, mousePos.y, mousePos.y, window.innerHeight + 200]
                    }}
                    transition={{
                        duration: 4,
                        times: [0, 0.4, 0.6, 1], // 40% corre, 20% agarra, 40% huye
                        ease: "easeIn"
                    }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        zIndex: 99999,
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <motion.img
                        src={porkbotImg}
                        alt="Porkbot Thief"
                        style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'contain',
                            clipPath: 'circle(45%)',
                            WebkitClipPath: 'circle(45%)',
                            filter: 'brightness(1.05) contrast(1.05)',
                            opacity: 1
                        }}
                        animate={{
                            rotate: [-5, 5, -5]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 0.3
                        }}
                    />

                    {/* El cursor falso que "roba" el Puerquito */}
                    <motion.div
                        animate={{
                            opacity: [0, 0, 1, 1], // Se vuelve visible justo cuando el puerquito llega
                            scale: [0, 0, 1, 1]
                        }}
                        transition={{
                            duration: 4,
                            times: [0, 0.35, 0.4, 1]
                        }}
                        style={{
                            marginLeft: '-20px',
                            marginTop: '-40px'
                        }}
                    >
                        <MousePointer2 size={36} color="black" fill="white" style={{ transform: 'rotate(-25deg)' }} />
                    </motion.div>

                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PorkbotCursorThief;
