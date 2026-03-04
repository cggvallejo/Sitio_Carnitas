import React from 'react';
import heroImage from '../assets/images/hero_tacos.png';

const Hero = () => {
    return (
        <section style={styles.hero}>
            <div className="container" style={styles.container}>
                <div style={styles.content}>
                    <h2 style={styles.subtitle}>Sabor Tradicional</h2>
                    <h1 style={styles.title}>Las Mejores Carnitas de la Región</h1>
                    <p style={styles.description}>
                        Tradición familiar en cada bocado. Nuestra maciza y cuerito son cocinados lentamente en cazos de cobre para lograr ese dorado perfecto y jugosidad incomparable.
                    </p>
                    <a href="#menu" style={styles.cta}>Ordenar Ahora</a>
                </div>
                <div style={styles.imageContainer}>
                    <img src={heroImage} alt="Delicious Carnitas" style={styles.image} className="animate-fade" />
                    <div style={styles.blob}></div>
                </div>
            </div>
        </section>
    );
};

const styles = {
    hero: {
        padding: '4rem 0',
        backgroundColor: 'var(--bg-color)',
        overflow: 'hidden',
        position: 'relative',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4rem',
        flexWrap: 'wrap',
    },
    content: {
        flex: '1',
        minWidth: '300px',
    },
    subtitle: {
        color: 'var(--primary)',
        textTransform: 'uppercase',
        letterSpacing: '3px',
        fontSize: '0.9rem',
        fontWeight: 700,
        marginBottom: '1rem',
        display: 'block',
    },
    title: {
        fontSize: '4rem',
        lineHeight: 1.1,
        marginBottom: '1.5rem',
        color: 'var(--text-main)',
    },
    description: {
        fontSize: '1.1rem',
        color: 'var(--text-muted)',
        marginBottom: '2rem',
        maxWidth: '500px',
    },
    cta: {
        display: 'inline-block',
        backgroundColor: 'var(--primary)',
        color: 'white',
        padding: '1rem 2.5rem',
        borderRadius: '50px',
        fontWeight: 600,
        fontSize: '1.1rem',
        boxShadow: '0 4px 15px rgba(211, 84, 0, 0.3)',
        transition: 'var(--transition)',
    },
    imageContainer: {
        flex: '1',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '300px',
    },
    image: {
        width: '100%',
        maxWidth: '500px',
        borderRadius: '30px',
        boxShadow: 'var(--shadow)',
        zIndex: 2,
        position: 'relative',
    },
    blob: {
        position: 'absolute',
        width: '120%',
        height: '120%',
        backgroundColor: 'rgba(211, 84, 0, 0.1)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        zIndex: 1,
    }
};

export default Hero;
