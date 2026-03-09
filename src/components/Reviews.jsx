import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, Instagram, Facebook, MapPin, CheckCircle2 } from 'lucide-react';

const Reviews = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [allReviews, setAllReviews] = useState(() => {
        const saved = localStorage.getItem('carnitas_reviews');
        return saved ? JSON.parse(saved) : [
            { id: 1, rating: 5, comment: "¡Las mejores de la ciudad!", date: "Hoy" },
            { id: 2, rating: 5, comment: "Excelente atención y sabor único.", date: "Ayer" }
        ];
    });

    const GOOGLE_MAPS_URL = "https://maps.google.com/?q=Carnitas+El+Patron+Guadalajara"; // Placeholder URL
    const INSTAGRAM_URL = "https://instagram.com/"; // Placeholder
    const FACEBOOK_URL = "https://facebook.com/"; // Placeholder

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) return;

        const newReview = {
            id: Date.now(),
            rating,
            comment,
            date: new Date().toLocaleDateString()
        };

        const updatedReviews = [newReview, ...allReviews];
        setAllReviews(updatedReviews);
        localStorage.setItem('carnitas_reviews', JSON.stringify(updatedReviews));

        setIsSubmitted(true);
    };

    const handleShare = (platform) => {
        const message = `¡Acabo de probar las mejores carnitas en La Patrona! ⭐ ${rating}/5. ${comment}`;
        let url = '';

        switch (platform) {
            case 'google':
                url = GOOGLE_MAPS_URL;
                break;
            case 'instagram':
                url = INSTAGRAM_URL;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`;
                break;
            default:
                break;
        }
        window.open(url, '_blank');
    };

    return (
        <section style={styles.section} id="reviews">
            <div className="container" style={styles.container}>
                <div style={styles.content}>
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        style={styles.subtitle}
                    >
                        TU OPINIÓN IMPORTA
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={styles.title}
                    >
                        ¿Qué te pareció <br /> <span style={{ color: 'var(--primary)' }}>La Patrona</span>?
                    </motion.h2>
                </div>

                <div style={styles.formCard} className="glass-premium">
                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onSubmit={handleSubmit}
                                style={styles.form}
                            >
                                <div style={styles.starsContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <motion.button
                                            key={star}
                                            type="button"
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                            style={styles.starBtn}
                                        >
                                            <Star
                                                size={42}
                                                fill={(hover || rating) >= star ? 'var(--accent)' : 'transparent'}
                                                color={(hover || rating) >= star ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}
                                                strokeWidth={1}
                                            />
                                        </motion.button>
                                    ))}
                                </div>

                                <textarea
                                    placeholder="Comparte tu experiencia con La Patrona..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    style={styles.textarea}
                                />

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={rating === 0}
                                    style={{
                                        ...styles.submitBtn,
                                        opacity: rating === 0 ? 0.3 : 1,
                                    }}
                                    className="metallic-border"
                                >
                                    ENVIAR MI RESEÑA
                                </motion.button>
                            </motion.form>
                        ) : (
                            // ... success content (unchanged structure but will inherit styles)
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={styles.successContainer}
                            >
                                <CheckCircle2 size={80} color="var(--accent)" strokeWidth={1} style={{ marginBottom: '2.5rem' }} />
                                <h3 style={styles.successTitle}>¡GRACIAS POR SU VISITA!</h3>
                                <p style={styles.successText}>Su paladar ha sido testigo de la tradición elevada a su máximo esplendor.</p>

                                <div style={styles.shareGrid}>
                                    <button onClick={() => handleShare('google')} style={styles.shareBtn} className="glass-premium">
                                        <MapPin size={24} color="var(--primary)" />
                                        GOOGLE MAPS
                                    </button>
                                    <button onClick={() => handleShare('instagram')} style={styles.shareBtn} className="glass-premium">
                                        <Instagram size={24} color="var(--primary)" />
                                        INSTAGRAM
                                    </button>
                                    <button onClick={() => handleShare('facebook')} style={styles.shareBtn} className="glass-premium">
                                        <Facebook size={24} color="var(--primary)" />
                                        FACEBOOK
                                    </button>
                                </div>
                                <button
                                    onClick={() => { setIsSubmitted(false); setRating(0); setComment(''); }}
                                    style={styles.resetBtn}
                                >
                                    DEJAR OTRA RESEÑA
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={styles.reviewsList}>
                    <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        style={styles.listTitle}
                    >
                        PALABRAS DE NUESTROS COMENSALES
                    </motion.h3>
                    <motion.div
                        style={styles.listGrid}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.15 }
                            }
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {allReviews.map((rev) => (
                            <motion.div
                                key={rev.id}
                                variants={{
                                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                                    visible: { opacity: 1, y: 0, scale: 1 }
                                }}
                                whileHover={{
                                    y: -10,
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                    borderColor: 'rgba(232, 208, 159, 0.4)'
                                }}
                                style={{
                                    ...styles.reviewItem,
                                    willChange: 'transform, opacity, box-shadow'
                                }}
                                className="glass-premium"
                            >
                                <div style={styles.itemHeader}>
                                    <div style={styles.itemStars}>
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.3 + (i * 0.1) }}
                                            >
                                                <Star
                                                    size={14}
                                                    fill={i < rev.rating ? 'var(--accent)' : 'transparent'}
                                                    color={i < rev.rating ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}
                                                    strokeWidth={1}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                    <span style={styles.itemDate}>{rev.date}</span>
                                </div>
                                <p style={styles.itemText}>"{rev.comment}"</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '12rem 0',
        backgroundColor: 'var(--bg-color)',
        borderTop: '1px solid rgba(179, 84, 30, 0.1)',
    },
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    content: {
        textAlign: 'center',
        marginBottom: '8rem',
        maxWidth: '700px',
    },
    subtitle: {
        display: 'block',
        color: 'var(--primary)',
        fontSize: '0.85rem',
        fontWeight: 700,
        letterSpacing: '0.4em',
        marginBottom: '2rem',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-display)',
    },
    title: {
        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
        fontFamily: 'var(--font-display)',
        color: 'var(--accent)',
        lineHeight: 1.1,
        fontWeight: 400,
    },
    formCard: {
        width: '100%',
        maxWidth: '850px',
        borderRadius: '3rem',
        padding: '5rem 4rem',
        position: 'relative',
        overflow: 'hidden',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4rem',
    },
    starsContainer: {
        display: 'flex',
        gap: '1.5rem',
    },
    starBtn: {
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
    },
    textarea: {
        width: '100%',
        height: '180px',
        backgroundColor: 'rgba(179, 84, 30, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '2rem',
        padding: '2rem',
        color: 'var(--text-main)',
        fontSize: '1.1rem',
        fontFamily: 'var(--font-sans)',
        outline: 'none',
        resize: 'none',
        transition: 'var(--transition)',
        textAlign: 'center',
    },
    submitBtn: {
        backgroundColor: 'var(--accent)',
        color: 'var(--bg-color)',
        border: 'none',
        padding: '1.5rem 4.5rem',
        fontSize: '0.85rem',
        fontWeight: 800,
        letterSpacing: '0.2em',
        borderRadius: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        transition: 'var(--transition)',
    },
    successContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    successTitle: {
        fontSize: '2rem',
        fontFamily: 'var(--font-display)',
        color: 'var(--accent)',
        letterSpacing: '0.1em',
        marginBottom: '1.5rem',
    },
    successText: {
        color: 'var(--text-muted)',
        fontSize: '1.1rem',
        marginBottom: '4rem',
        maxWidth: '450px',
    },
    shareGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '2rem',
        width: '100%',
        marginBottom: '4rem',
    },
    shareBtn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.2rem',
        padding: '2.5rem',
        backgroundColor: 'rgba(179, 84, 30, 0.03)',
        border: '1px solid rgba(179, 84, 30, 0.15)',
        borderRadius: '1.5rem',
        color: 'var(--accent-light)',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.15em',
        cursor: 'pointer',
        transition: 'var(--transition)',
    },
    resetBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--primary)',
        fontSize: '0.85rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    reviewsList: {
        width: '100%',
        marginTop: '10rem',
    },
    listTitle: {
        fontSize: '1.2rem',
        letterSpacing: '0.3em',
        color: 'var(--primary)',
        textAlign: 'center',
        marginBottom: '5rem',
        fontWeight: 400,
        textTransform: 'uppercase',
        fontFamily: 'var(--font-display)',
    },
    listGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
    },
    reviewItem: {
        borderRadius: '2rem',
        padding: '3rem 2.5rem',
        transition: 'var(--transition)',
    },
    itemHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    itemStars: {
        display: 'flex',
        gap: '0.4rem',
    },
    itemDate: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
    },
    itemText: {
        fontSize: '1rem',
        color: 'var(--accent-light)',
        lineHeight: 1.8,
        margin: 0,
        fontWeight: 300,
        fontStyle: 'italic',
    }
};

export default Reviews;
