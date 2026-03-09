import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';

const Header = () => {
    const { cartCount, setIsCartOpen } = useCart();

    return (
        <header style={styles.header}>
            <div className="container" style={styles.container}>
                <div style={styles.logoContainer}>
                    <motion.img
                        whileHover={{ rotate: 10 }}
                        src={logo}
                        alt="Carnitas El Patrón Logo"
                        style={styles.logo}
                    />
                    <h1 style={styles.title}>EL PATRÓN</h1>
                </div>

                <nav style={styles.nav}>
                    <a href="#menu" style={styles.navLink}>Menú</a>
                    <a href="#reviews" style={styles.navLink}>Reseñas</a>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCartOpen(true)}
                        style={styles.cartBtn}
                    >
                        <ShoppingCart size={20} strokeWidth={2.5} />
                        {cartCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={styles.cartBadge}
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </motion.button>
                </nav>
            </div>
        </header>
    );
};

const styles = {
    header: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '90px',
        backgroundColor: 'var(--glass)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        backdropFilter: 'blur(20px)',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 4rem',
        maxWidth: '1800px',
        margin: '0 auto',
        width: '100%',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    logo: {
        height: '45px',
        width: '45px',
        objectFit: 'contain',
    },
    title: {
        fontSize: '1.4rem',
        fontFamily: 'var(--font-serif)',
        color: 'var(--accent)',
        letterSpacing: '0.2em',
        fontWeight: 400,
        margin: 0,
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '2.5rem',
    },
    navLink: {
        color: 'var(--text-muted)',
        textDecoration: 'none',
        fontSize: '0.85rem',
        fontWeight: 400,
        letterSpacing: '0.2em',
        transition: 'var(--transition)',
        textTransform: 'uppercase',
    },
    cartBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--accent)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.8rem',
        transition: 'var(--transition)',
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: '0',
        right: '0',
        background: 'var(--primary)',
        color: 'white',
        fontSize: '0.65rem',
        padding: '2px 6px',
        borderRadius: '50%',
        fontWeight: 600,
    },
};

export default Header;
