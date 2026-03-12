import { motion } from 'framer-motion';

const About = () => {
    return (
        <section style={styles.about} id="quienes-somos">
            <div className="container" style={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={styles.content}
                    className="glass-premium about-content"
                >
                    <h2 className="metallic-text" style={styles.title}>Quiénes Somos</h2>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        viewport={{ once: true }}
                    >
                        <p style={styles.text}>
                            Somos un restaurante familiar en donde le ponemos todo nuestro corazón y cariño a la elaboración de nuestros platillos. Te invitamos a hacer un recorrido gastronómico comenzando con nuestras deliciosas carnitas, que son únicas e inigualables, y por supuesto, a que hagas una parada obligatoria para disfrutar de las mejores quesadillas al comal.
                        </p>
                        <p style={styles.text}>
                            Están elaboradas con masa cien por ciento de maíz, con guisados que te recordarán el sabor de hogar que tanto te gusta y que en Cancún tanto se extraña.
                        </p>
                        <p style={styles.textHighlight}>
                            Todos nuestros platillos están hechos con la mejor calidad, porque nuestro compromiso es sacarte una sonrisa y dejarte un buen sabor de boca en cada bocado.
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative element matching the site aesthetic */}
            <div style={styles.decoCircle}></div>
        </section>
    );
};

const styles = {
    about: {
        padding: '10rem 0',
        backgroundColor: 'var(--bg-color)',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
    },
    content: {
        padding: '5rem',
        borderRadius: '2rem',
        textAlign: 'center',
        border: '1px solid rgba(232, 208, 159, 0.15)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
        backgroundColor: 'rgba(10, 10, 10, 0.7)',
        backdropFilter: 'blur(30px)',
    },
    title: {
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(3rem, 6vw, 4.5rem)',
        marginBottom: '3.5rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    },
    text: {
        fontSize: '1.25rem',
        color: 'var(--text-muted)',
        lineHeight: '1.9',
        marginBottom: '2rem',
        fontWeight: 300,
        maxWidth: '800px',
        margin: '0 auto 2rem',
    },
    textHighlight: {
        fontSize: '1.35rem',
        color: 'var(--text-main)',
        lineHeight: '1.9',
        marginTop: '3.5rem',
        marginBottom: '1rem',
        fontWeight: 400,
        maxWidth: '800px',
        margin: '3.5rem auto 1rem',
        borderTop: '1px solid rgba(232, 208, 159, 0.2)',
        paddingTop: '2.5rem',
        letterSpacing: '0.02em',
    },
    decoCircle: {
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(179, 84, 30, 0.05) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        pointerEvents: 'none',
    }
};

export default About;
