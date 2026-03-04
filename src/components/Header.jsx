import React from 'react';
import { useCart } from '../context/CartContext';
import logo from '../assets/images/logo.png';

const Header = () => {
    const { cartCount, setIsCartOpen } = useCart();

    return (
        <header style={styles.header}>
            <div className="container" style={styles.container}>
                <div style={styles.logoContainer}>
                    <img src={logo} alt="Carnitas El Patrón Logo" style={styles.logo} />
                    <h1 style={styles.title}>El Patrón</h1>
                </div>

                <nav style={styles.nav}>
                    <a href="#menu" style={styles.navLink}>Menú</a>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        style={styles.cartBtn}
                    >
                        <span style={styles.cartIcon}>🛒</span>
                        {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                    </button>
                </nav>
            </div>
        </header>
    );
};

const styles = {
    header: {
        padding: '1rem 0',
        backgroundColor: 'var(--glass)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(0,0,0,0.05)',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    logo: {
        height: '50px',
        borderRadius: '50%',
    },
    title: {
        fontSize: '1.5rem',
        color: 'var(--primary)',
        margin: 0,
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
    },
    navLink: {
        fontWeight: 600,
        color: 'var(--text-main)',
    },
    cartBtn: {
        background: 'var(--primary)',
        color: 'white',
        padding: '0.6rem 1.2rem',
        borderRadius: '50px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        position: 'relative',
        fontSize: '1.1rem',
    },
    cartBadge: {
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        background: 'var(--accent)',
        color: 'white',
        fontSize: '0.7rem',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        border: '2px solid white',
    },
    cartIcon: {
        fontSize: '1.2rem',
    }
};

export default Header;
