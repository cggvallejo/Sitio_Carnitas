import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock } from 'lucide-react';

import { locationsData } from '../data/locations';

const Locations = () => {
    return (
        <section id="sucursales" style={styles.section}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={styles.header}
                >
                    <h2 style={styles.title} className="metallic-text">NUESTRAS SUCURSALES</h2>
                    <p style={styles.subtitle}>
                        Encuentra la sucursal de Carnitas La Patrona más cercana y ven a disfrutar de nuestro inigualable sabor.
                    </p>
                </motion.div>

                <div style={styles.grid}>
                    {locationsData.map((loc, index) => (
                        <motion.div
                            key={loc.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            style={styles.cardWrapper}
                            className="glass-premium"
                            whileHover={{ y: -10 }}
                        >
                            <div style={{ ...styles.imagePlaceholder, backgroundImage: `url(${loc.image})` }}>
                                <div style={styles.imageOverlay}></div>
                            </div>

                            <div style={styles.cardContent}>
                                <h3 style={styles.cardTitle}>{loc.name}</h3>

                                <div style={styles.infoRow}>
                                    <MapPin size={18} style={styles.icon} />
                                    <span style={styles.infoText}>{loc.address}</span>
                                </div>

                                <div style={styles.infoRow}>
                                    <Phone size={18} style={styles.icon} />
                                    <span style={styles.infoText}>{loc.phone}</span>
                                </div>

                                <div style={styles.infoRow}>
                                    <Clock size={18} style={styles.icon} />
                                    <span style={styles.infoText}>{loc.hours}</span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={styles.actionBtn}
                                >
                                    CÓMO LLEGAR
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Subtle background glow */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '20%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(142, 74, 45, 0.1) 0%, transparent 70%)',
                filter: 'blur(50px)',
                zIndex: -1,
                pointerEvents: 'none'
            }} />
        </section>
    );
};

const styles = {
    section: {
        padding: '100px 0',
        position: 'relative',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid rgba(232, 208, 159, 0.05)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '60px',
        maxWidth: '800px',
        margin: '0 auto 60px auto',
    },
    title: {
        fontSize: '3rem',
        marginBottom: '1rem',
        textTransform: 'uppercase',
    },
    subtitle: {
        color: 'var(--text-muted)',
        fontSize: '1.1rem',
        lineHeight: 1.8,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '40px',
        padding: '0 20px',
    },
    cardWrapper: {
        borderRadius: '24px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(232, 208, 159, 0.1)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    },
    imagePlaceholder: {
        height: '250px',
        width: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        borderBottom: '2px solid var(--primary)',
    },
    imageOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0) 100%)',
    },
    cardContent: {
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        flexGrow: 1,
    },
    cardTitle: {
        fontSize: '1.8rem',
        color: 'var(--accent)',
        fontFamily: 'var(--font-display)',
        marginBottom: '10px',
        letterSpacing: '0.05em',
    },
    infoRow: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
    },
    icon: {
        color: 'var(--primary)',
        marginTop: '3px',
        flexShrink: 0,
    },
    infoText: {
        color: 'var(--text-main)',
        fontSize: '0.95rem',
        lineHeight: 1.5,
        opacity: 0.9,
    },
    actionBtn: {
        marginTop: '20px',
        padding: '12px 0',
        width: '100%',
        background: 'transparent',
        border: '1px solid var(--accent)',
        color: 'var(--accent)',
        borderRadius: '12px',
        fontSize: '0.85rem',
        fontWeight: 600,
        letterSpacing: '0.2em',
        cursor: 'pointer',
        transition: 'var(--transition)',
        textTransform: 'uppercase',
    }
};

export default Locations;
