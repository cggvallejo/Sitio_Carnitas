import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/hero_tacos.png';

const Hero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section style={styles.hero}>
            <motion.div
                style={styles.dynamicBg}
                animate={{
                    background: [
                        'radial-gradient(circle at 70% 50%, rgba(255, 20, 147, 0.15) 0%, transparent 70%)',
                        'radial-gradient(circle at 30% 50%, rgba(255, 20, 147, 0.15) 0%, transparent 70%)',
                        'radial-gradient(circle at 70% 50%, rgba(255, 20, 147, 0.15) 0%, transparent 70%)'
                    ]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
                className="container hero-container"
                style={{ ...styles.container, opacity }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div style={styles.content}>
                    <motion.div variants={itemVariants} style={styles.badge}>
                        <Sparkles size={14} />
                        <span>SABER HACER TRADICIONAL</span>
                    </motion.div>

                    <motion.h1 style={styles.title} variants={containerVariants}>
                        <div>
                            <motion.span
                                variants={itemVariants}
                                className="metallic-text"
                                style={{ display: 'inline-block' }}
                            >
                                El Arte de la
                            </motion.span>
                        </div>
                        <div>
                            <motion.span
                                variants={itemVariants}
                                style={{ ...styles.titleHighlight, display: 'inline-block' }}
                            >
                                Lenta Cocción
                            </motion.span>
                        </div>
                    </motion.h1>

                    <motion.p variants={itemVariants} style={styles.description}>
                        Elevamos la tradición a un nivel gourmet inolvidable. Cada bocado de nuestras carnitas cuenta una historia de paciencia, fuego y herencia.
                    </motion.p>

                    <motion.div className="hero-cta-group" variants={itemVariants} style={styles.ctaGroup}>
                        <motion.a
                            href="#menu"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0 20px 40px rgba(255, 20, 147, 0.4)',
                                backgroundColor: 'var(--primary-dark)'
                            }}
                            whileTap={{ scale: 0.95 }}
                            style={{ ...styles.primaryBtn, textDecoration: 'none', display: 'inline-block' }}
                        >
                            EXPLORAR MENÚ
                        </motion.a>
                        <motion.a
                            href="#quienes-somos"
                            whileHover={{ x: 15, color: 'var(--accent-light)' }}
                            style={{ ...styles.secondaryBtn, textDecoration: 'none' }}
                        >
                            NUESTRA HISTORIA <span style={{ transition: '0.3s' }}>→</span>
                        </motion.a>
                    </motion.div>
                </div>

                <motion.div
                    className="hero-image-wrapper"
                    style={{ ...styles.imageWrapper, y: y1 }}
                    initial={{ opacity: 0, scale: 0.8, x: 100 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.div
                        className="glass-premium"
                        style={{
                            ...styles.imageGlass,
                            willChange: 'transform'
                        }}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 1, 0]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <motion.img
                            src={heroImg}
                            alt="Carnitas Gourmet"
                            style={{
                                ...styles.image,
                                willChange: 'transform'
                            }}
                            animate={{ scale: [1.1, 1, 1.1] }}
                            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                        />
                    </motion.div>

                    <motion.div
                        className="hero-floating-badge"
                        style={{ ...styles.floatingBadge, willChange: 'transform, opacity' }}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5, duration: 1 }}
                    >
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        >
                            <p style={styles.floatingTitle}>EST. 1985</p>
                            <p style={styles.floatingText}>MAESTRÍA PURA</p>
                        </motion.div>
                    </motion.div>

                    {/* Decorative Elements */}
                    <div style={styles.decoCircle}></div>
                </motion.div>
            </motion.div>

            <motion.div
                style={styles.scrollIndicator}
                animate={{
                    y: [0, 20, 0],
                    opacity: [0.3, 1, 0.3]
                }}
                transition={{ repeat: Infinity, duration: 3 }}
            >
                <div style={styles.scrollLine}></div>
                <ChevronDown size={20} color="var(--accent)" />
            </motion.div>
        </section>
    );
};

const styles = {
    hero: {
        height: '110vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: 'var(--bg-color)',
        overflow: 'hidden',
        paddingTop: '100px',
    },
    dynamicBg: {
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
    },
    container: {
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        alignItems: 'center',
        gap: '6rem',
        zIndex: 2,
        position: 'relative',
    },
    content: {
        position: 'relative',
        zIndex: 3,
    },
    badge: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        color: 'var(--primary)',
        fontSize: '0.8rem',
        fontWeight: 800,
        letterSpacing: '0.5em',
        marginBottom: '2.5rem',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 'clamp(4rem, 10vw, 8.5rem)',
        lineHeight: '1.4',
        marginBottom: '3rem',
        letterSpacing: '-0.04em',
        fontFamily: 'var(--font-display)',
    },
    titleHighlight: {
        color: 'var(--text-main)',
        opacity: 0.95,
    },
    description: {
        fontSize: '1.3rem',
        color: 'var(--text-muted)',
        maxWidth: '600px',
        marginBottom: '4.5rem',
        fontWeight: 200,
        lineHeight: '1.8',
    },
    ctaGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '4rem',
    },
    primaryBtn: {
        padding: '1.8rem 4rem',
        backgroundColor: 'var(--primary)',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '0.9rem',
        fontWeight: 800,
        letterSpacing: '0.3em',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        transition: 'var(--transition)',
    },
    secondaryBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--accent)',
        fontSize: '0.9rem',
        fontWeight: 600,
        letterSpacing: '0.2em',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        transition: '0.4s',
    },
    imageWrapper: {
        position: 'relative',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageGlass: {
        height: '90%',
        width: '100%',
        borderRadius: '2rem',
        padding: '2rem',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 2,
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '1rem',
    },
    floatingBadge: {
        position: 'absolute',
        top: '15%',
        right: '-10%',
        padding: '3rem 2.5rem',
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(232, 208, 159, 0.3)',
        borderRadius: '1rem',
        textAlign: 'center',
        minWidth: '220px',
        zIndex: 4,
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
    },
    floatingTitle: {
        color: 'var(--accent)',
        fontSize: '1.6rem',
        fontFamily: 'var(--font-display)',
        marginBottom: '0.8rem',
        letterSpacing: '0.05em',
    },
    floatingText: {
        color: 'var(--text-main)',
        fontSize: '0.7rem',
        letterSpacing: '0.4em',
        fontWeight: 900,
        opacity: 0.6,
    },
    decoCircle: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        border: '1px dashed rgba(232, 208, 159, 0.1)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
    },
    scrollIndicator: {
        position: 'absolute',
        bottom: '4rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
    },
    scrollLine: {
        width: '1px',
        height: '60px',
        background: 'linear-gradient(to bottom, var(--accent), transparent)',
    }
};

export default Hero;
