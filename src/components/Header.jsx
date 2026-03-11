import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/images/logo.png';

const navLinks = [
    { href: '#quienes-somos', label: 'QUIÉNES SOMOS' },
    { href: '#menu',          label: 'NUESTRO MENÚ'  },
    { href: '#sucursales',    label: 'SUCURSALES'    },
    { href: '#reviews',       label: 'RESEÑAS'       },
];

const Header = () => {
    const { cartCount, setIsCartOpen } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ ...styles.header, willChange: 'transform, opacity' }}
            >
                <div className="container" style={styles.container}>
                    {/* Logo */}
                    <motion.div style={styles.logoContainer} whileHover={{ scale: 1.05 }}>
                        <img src={logo} alt="Carnitas El Patrón" style={styles.logoImg} />
                    </motion.div>

                    {/* Nav escritorio */}
                    <nav className="nav-desktop" style={styles.nav}>
                        {navLinks.map(link => (
                            <motion.a
                                key={link.href}
                                href={link.href}
                                className="nav-link"
                                style={styles.navLink}
                                whileHover={{ color: 'var(--accent)', opacity: 1, y: -3 }}
                            >
                                {link.label}
                            </motion.a>
                        ))}
                        <CartBtn cartCount={cartCount} setIsCartOpen={setIsCartOpen} />
                    </nav>

                    {/* Móvil: carrito + hamburguesa */}
                    <div className="mobile-right-header" style={styles.mobileRight}>
                        <CartBtn cartCount={cartCount} setIsCartOpen={setIsCartOpen} />
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMenuOpen(!menuOpen)}
                            style={styles.hamburger}
                            aria-label="Menú"
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* Menú desplegable móvil */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        style={styles.mobileMenu}
                    >
                        {navLinks.map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                style={styles.mobileLink}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const CartBtn = ({ cartCount, setIsCartOpen }) => (
    <motion.button
        whileHover={{
            scale: 1.1,
            boxShadow: '0 15px 30px rgba(232, 208, 159, 0.25)',
            borderColor: 'var(--accent)',
            backgroundColor: 'rgba(232, 208, 159, 0.1)'
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCartOpen(true)}
        style={styles.cartBtn}
        className="glass-premium"
    >
        <ShoppingCart size={20} strokeWidth={1.5} />
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
);

const styles = {
    header: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '120px',
        backgroundColor: 'rgba(5, 5, 5, 0.4)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        backdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(232, 208, 159, 0.05)',
        transition: 'var(--transition)',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 30px',
        height: '120px',
        backgroundColor: 'transparent',
    },
    logoImg: {
        height: '92px',
        objectFit: 'contain',
        filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.5))',
        imageRendering: 'high-quality',
        willChange: 'transform'
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '2.5rem',
    },
    navLink: {
        color: 'var(--text-main)',
        textDecoration: 'none',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.3em',
        transition: 'var(--transition)',
        opacity: 0.7,
    },
    cartBtn: {
        background: 'rgba(232, 208, 159, 0.05)',
        border: '1px solid rgba(232, 208, 159, 0.2)',
        color: 'var(--accent)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '55px',
        height: '55px',
        borderRadius: '50%',
        transition: 'var(--transition)',
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        background: 'var(--primary)',
        color: 'white',
        fontSize: '0.65rem',
        width: '22px',
        height: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        fontWeight: 700,
        boxShadow: '0 5px 15px rgba(179, 84, 30, 0.4)',
    },
    /* Móvil */
    mobileRight: {
        display: 'none',
        alignItems: 'center',
        gap: '0.8rem',
    },
    hamburger: {
        background: 'transparent',
        border: '1px solid rgba(232, 208, 159, 0.2)',
        color: 'var(--accent)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        borderRadius: '0.5rem',
    },
    mobileMenu: {
        position: 'fixed',
        top: '120px',
        left: 0,
        right: 0,
        backgroundColor: 'rgba(10, 3, 16, 0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(232, 208, 159, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1.5rem 2rem',
        gap: '0.5rem',
        zIndex: 999,
    },
    mobileLink: {
        color: 'var(--text-main)',
        padding: '1rem 1.2rem',
        borderRadius: '0.6rem',
        fontSize: '0.85rem',
        fontWeight: 600,
        letterSpacing: '0.3em',
        textDecoration: 'none',
        borderBottom: '1px solid rgba(232, 208, 159, 0.06)',
        opacity: 0.85,
    },
};

export default Header;
