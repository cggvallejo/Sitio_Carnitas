import React from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const ProductGrid = () => {
    const { addToCart } = useCart();

    return (
        <section id="menu" style={styles.section}>
            <div className="container">
                <h2 style={styles.title}>Nuestro Menú</h2>
                <div style={styles.grid}>
                    {products.map((item) => (
                        <div key={item.id} style={styles.card} className="hover-lift animate-fade">
                            <div style={styles.imageContainer}>
                                <img src={item.image} alt={item.name} style={styles.image} />
                                <span style={styles.categoryBadge}>{item.category}</span>
                            </div>
                            <div style={styles.content}>
                                <h3 style={styles.name}>{item.name}</h3>
                                <p style={styles.description}>{item.description}</p>
                                <div style={styles.footer}>
                                    <span style={styles.price}>${item.price.toFixed(2)}</span>
                                    <button
                                        onClick={() => addToCart(item)}
                                        style={styles.addBtn}
                                        className="button-pop"
                                    >
                                        Añadir +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '6rem 0',
        backgroundColor: 'var(--white)',
    },
    title: {
        fontSize: '2.5rem',
        textAlign: 'center',
        marginBottom: '4rem',
        color: 'var(--text-main)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2.5rem',
    },
    card: {
        backgroundColor: 'var(--card-bg)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
        transition: 'var(--transition)',
        border: '1px solid rgba(0,0,0,0.03)',
    },
    imageContainer: {
        position: 'relative',
        height: '200px',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'var(--transition)',
    },
    category: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'var(--primary)',
        color: 'white',
        padding: '0.3rem 0.8rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
    },
    info: {
        padding: '1.5rem',
    },
    name: {
        fontSize: '1.3rem',
        marginBottom: '0.5rem',
        color: 'var(--text-main)',
    },
    description: {
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        marginBottom: '1.5rem',
        height: '3.6rem',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--primary)',
    },
    addBtn: {
        backgroundColor: 'var(--primary)',
        color: 'white',
        padding: '0.6rem 1.2rem',
        borderRadius: '10px',
        fontWeight: 600,
        fontSize: '0.9rem',
        boxShadow: '0 4px 12px rgba(211, 84, 0, 0.2)',
    }
};

export default ProductGrid;
