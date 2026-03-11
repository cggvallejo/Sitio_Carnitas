import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const ProductGrid = () => {
    const { addToCart } = useCart();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section id="menu" style={styles.section}>
            <div className="container">
                <motion.div
                    style={styles.headerContent}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2 }}
                >
                    <span style={styles.subtitle}>MENÚ PATRONA</span>
                    <h2 style={styles.title}>Selección Gourmet</h2>
                    <p style={styles.headerText}>
                        Cada plato es una obra maestra de la cocina tradicional, elevada con ingredientes de la más alta calidad y un proceso artesanal inigualable.
                    </p>
                </motion.div>

                <motion.div
                    className="product-grid"
                    style={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {products.map((item) => (
                        <motion.div
                            key={item.id}
                            style={{
                                ...styles.card,
                                willChange: 'transform, box-shadow'
                            }}
                            className="glass-premium"
                            variants={cardVariants}
                            whileHover={{
                                y: -15,
                                rotateX: 2,
                                rotateY: -2,
                                boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
                                borderColor: 'rgba(232, 208, 159, 0.5)'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <div style={styles.imageContainer}>
                                <motion.img
                                    whileHover={{ scale: 1.15 }}
                                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                                    src={item.image}
                                    alt={item.name}
                                    style={{
                                        ...styles.image,
                                        willChange: 'transform'
                                    }}
                                />
                                <div style={styles.badgeWrapper}>
                                    <motion.span
                                        initial={{ x: -20, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        style={styles.categoryBadge}
                                    >
                                        {item.category}
                                    </motion.span>
                                </div>
                            </div>
                            <div style={styles.content}>
                                <h3 style={styles.name}>{item.name}</h3>
                                <div style={styles.divider}></div>
                                <p style={styles.description}>{item.description}</p>
                                <div style={styles.footer}>
                                    <div style={styles.priceContainer}>
                                        <span style={styles.priceCurrency}>$</span>
                                        <span style={styles.priceValue}>{item.price.toFixed(2)}</span>
                                    </div>
                                    <motion.button
                                        whileHover={{
                                            backgroundColor: 'var(--accent)',
                                            color: 'var(--bg-color)',
                                            scale: 1.05
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => addToCart(item)}
                                        style={styles.addBtn}
                                    >
                                        AÑADIR AL PEDIDO
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '15rem 0',
        backgroundColor: 'var(--bg-color)',
        position: 'relative',
    },
    headerContent: {
        textAlign: 'center',
        marginBottom: '10rem',
        maxWidth: '800px',
        margin: '0 auto 10rem auto',
    },
    subtitle: {
        display: 'block',
        color: 'var(--primary)',
        fontSize: '0.85rem',
        fontWeight: 800,
        letterSpacing: '0.6em',
        marginBottom: '2rem',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 'clamp(3rem, 6vw, 6rem)',
        color: 'var(--accent)',
        fontFamily: 'var(--font-display)',
        marginBottom: '2.5rem',
        fontWeight: 400,
        letterSpacing: '0.05em',
    },
    headerText: {
        color: 'var(--text-muted)',
        fontSize: '1.2rem',
        lineHeight: '1.9',
        fontWeight: 200,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
        gap: '6rem',
        padding: '0 4rem',
        maxWidth: '1800px',
        margin: '0 auto',
    },
    card: {
        borderRadius: '0.5rem',
        overflow: 'hidden',
        transition: 'var(--transition)',
        position: 'relative',
    },
    imageContainer: {
        position: 'relative',
        height: '400px',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    badgeWrapper: {
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        zIndex: 2,
    },
    categoryBadge: {
        backgroundColor: 'rgba(5, 5, 5, 0.85)',
        backdropFilter: 'blur(10px)',
        color: 'var(--accent)',
        padding: '0.8rem 1.5rem',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        border: '1px solid rgba(232, 208, 159, 0.3)',
    },
    content: {
        padding: '3.5rem',
    },
    name: {
        fontSize: '2.2rem',
        fontFamily: 'var(--font-display)',
        color: 'var(--accent)',
        marginBottom: '0.8rem',
        fontWeight: 400,
    },
    divider: {
        width: '40px',
        height: '2px',
        background: 'var(--primary)',
        marginBottom: '1.2rem',
    },
    description: {
        fontSize: '1rem',
        color: 'var(--text-muted)',
        lineHeight: '1.8',
        marginBottom: '3.5rem',
        fontWeight: 300,
        height: '3.6rem',
        overflow: 'hidden',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '2.5rem',
        borderTop: '1px solid rgba(232, 208, 159, 0.1)',
    },
    priceContainer: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.5rem',
    },
    priceCurrency: {
        fontSize: '1rem',
        color: 'var(--primary)',
        fontWeight: 700,
    },
    priceValue: {
        fontSize: '2rem',
        color: 'var(--accent)',
        fontWeight: 400,
        fontFamily: 'var(--font-serif)',
    },
    addBtn: {
        background: 'none',
        border: '1px solid var(--accent)',
        color: 'var(--accent)',
        padding: '1.2rem 2.8rem',
        fontSize: '0.75rem',
        fontWeight: 800,
        letterSpacing: '0.2em',
        cursor: 'pointer',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    }
};

export default ProductGrid;
