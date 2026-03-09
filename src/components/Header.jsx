import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';

const Header = () => {
    const { cartCount, setIsCartOpen } = useCart();

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
                ...styles.header,
                willChange: 'transform, opacity'
            }}
        >
            <div className="container" style={styles.container}>
                <motion.div
                    style={styles.logoContainer}
                    whileHover={{ scale: 1.05 }}
                >
                    <img src={logo} alt="Carnitas La Patrona" style={styles.logoImg} />
                </motion.div>

                <nav style={styles.nav}>
                    <motion.a
                        href="#quienes-somos"
                        className="nav-link"
                        style={styles.navLink}
                        whileHover={{ color: 'var(--accent)', opacity: 1, y: -3 }}
                    >
                        QUIÉNES SOMOS
                    </motion.a>
                    <motion.a
                        href="#menu"
                        className="nav-link"
                        style={styles.navLink}
                        whileHover={{ color: 'var(--accent)', opacity: 1, y: -3 }}
                    >
                        NUESTRO MENÚ
                    </motion.a>
                    <motion.a
                        href="#sucursales"
                        className="nav-link"
                        style={styles.navLink}
                        whileHover={{ color: 'var(--accent)', opacity: 1, y: -3 }}
                    >
                        SUCURSALES
                    </motion.a>
                    <motion.a
                        href="#reviews"
                        className="nav-link"
                        style={styles.navLink}
                        whileHover={{ color: 'var(--accent)', opacity: 1, y: -3 }}
                    >
                        RESEÑAS
                    </motion.a>
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
                                whileHover={{ scale: 1.2 }}
                                style={styles.cartBadge}
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </motion.button>
                </nav>
            </div>
        </motion.header>
    );
};

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
        padding: '0 4rem',
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
        gap: '4rem',
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
};

export default Header;
