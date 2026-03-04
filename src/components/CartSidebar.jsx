import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import MercadoPagoBtn from './MercadoPagoBtn';

const CartSidebar = () => {
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        updateQuantity,
        removeFromCart,
        cartTotal
    } = useCart();

    const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'selection', 'mercadopago'
    const [paymentMethod, setPaymentMethod] = useState(null);

    const handleWhatsAppCheckout = (methodOverride = null) => {
        const method = methodOverride || paymentMethod || 'WhatsApp';
        const methodText = method === 'cash' ? 'Pago en Efectivo' : method === 'terminal' ? 'Pago con Terminal' : 'Pedido de WhatsApp';

        const phone = "521234567890"; // Reemplazar con el número real
        const itemsList = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
        const text = encodeURIComponent(`¡Hola! Me gustaría hacer un pedido:\n\n${itemsList}\n\nTotal: $${cartTotal.toFixed(2)}\nMetodo de Pago: ${methodText}\n\nMuchas gracias.`);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    };

    if (!isCartOpen) return null;

    const renderCheckoutContent = () => {
        if (checkoutStep === 'mercadopago') {
            return <MercadoPagoBtn amount={cartTotal} />;
        }

        if (checkoutStep === 'selection') {
            return (
                <div style={styles.selectionView}>
                    <h4 style={styles.sectionTitle}>¿Cómo deseas pagar?</h4>
                    <button
                        style={styles.methodOption}
                        onClick={() => setCheckoutStep('mercadopago')}
                    >
                        <span style={styles.methodIcon}>💳</span>
                        <div style={styles.methodDetails}>
                            <strong>Tarjeta de Crédito/Débito</strong>
                            <small>Pago seguro con Mercado Pago</small>
                        </div>
                    </button>

                    <button
                        style={styles.methodOption}
                        onClick={() => {
                            setPaymentMethod('cash');
                            handleWhatsAppCheckout('cash');
                        }}
                    >
                        <span style={styles.methodIcon}>💵</span>
                        <div style={styles.methodDetails}>
                            <strong>Pago en Efectivo</strong>
                            <small>Pagas al recibir tu pedido</small>
                        </div>
                    </button>

                    <button
                        style={styles.methodOption}
                        onClick={() => {
                            setPaymentMethod('terminal');
                            handleWhatsAppCheckout('terminal');
                        }}
                    >
                        <span style={styles.methodIcon}>📟</span>
                        <div style={styles.methodDetails}>
                            <strong>Solicitar Terminal</strong>
                            <small>Llevamos la terminal a tu domicilio</small>
                        </div>
                    </button>
                </div>
            );
        }

        return (
            cart.length === 0 ? (
                <p style={styles.emptyMsg}>Tu carrito está vacío 🌮</p>
            ) : (
                cart.map((item) => (
                    <div key={item.id} style={styles.item}>
                        <img src={item.image} alt={item.name} style={styles.itemImage} />
                        <div style={styles.itemInfo}>
                            <h4 style={styles.itemName}>{item.name}</h4>
                            <p style={styles.itemPrice}>${item.price.toFixed(2)}</p>
                            <div style={styles.qtyControls}>
                                <button onClick={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>+</button>
                            </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>🗑️</button>
                    </div>
                ))
            )
        );
    };

    return (
        <>
            <div style={styles.overlay} onClick={() => {
                setIsCartOpen(false);
                setCheckoutStep('cart');
            }}></div>
            <div style={styles.sidebar} className="animate-slide">
                <div style={styles.header}>
                    <h3>
                        {checkoutStep === 'mercadopago' ? 'Pago con Tarjeta' :
                            checkoutStep === 'selection' ? 'Seleccionar Pago' : 'Tu Carrito'}
                    </h3>
                    <button onClick={() => {
                        setIsCartOpen(false);
                        setCheckoutStep('cart');
                    }} style={styles.closeBtn}>✕</button>
                </div>

                <div style={styles.itemsList}>
                    {renderCheckoutContent()}
                </div>

                {cart.length > 0 && checkoutStep === 'cart' && (
                    <div style={styles.checkout}>
                        <div style={styles.totalRow}>
                            <span>Total:</span>
                            <span style={styles.totalAmount}>${cartTotal.toFixed(2)}</span>
                        </div>

                        <div style={styles.actions}>
                            <button
                                style={styles.cardBtn}
                                onClick={() => setCheckoutStep('selection')}
                            >
                                Finalizar Pedido 🛒
                            </button>
                        </div>
                    </div>
                )}

                {checkoutStep !== 'cart' && (
                    <div style={styles.backContainer}>
                        <button
                            onClick={() => setCheckoutStep(checkoutStep === 'mercadopago' ? 'selection' : 'cart')}
                            style={styles.backBtn}
                        >
                            ← Volver
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 998,
        backdropFilter: 'blur(3px)',
    },
    sidebar: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        zIndex: 999,
        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.4s ease forwards',
    },
    header: {
        padding: '2rem',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeBtn: {
        background: 'none',
        fontSize: '1.2rem',
        color: 'var(--text-muted)',
    },
    itemsList: {
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
    },
    emptyMsg: {
        textAlign: 'center',
        marginTop: '3rem',
        color: 'var(--text-muted)',
    },
    item: {
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        borderBottom: '1px solid #f5f5f5',
        alignItems: 'center',
    },
    itemImage: {
        width: '60px',
        height: '60px',
        borderRadius: '10px',
        objectFit: 'cover',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: '1rem',
        marginBottom: '0.2rem',
    },
    itemPrice: {
        fontSize: '0.9rem',
        color: 'var(--primary)',
        fontWeight: 'bold',
    },
    qtyControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        marginTop: '0.5rem',
    },
    qtyBtn: {
        width: '24px',
        height: '24px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'white',
    },
    removeBtn: {
        background: 'none',
        fontSize: '1.2rem',
    },
    checkout: {
        padding: '2rem',
        borderTop: '1px solid #eee',
        backgroundColor: '#fafafa',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        fontSize: '1.2rem',
        fontWeight: 'bold',
    },
    totalAmount: {
        color: 'var(--primary)',
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
    },
    wsBtn: {
        width: '100%',
        padding: '1rem',
        borderRadius: '12px',
        backgroundColor: '#25D366',
        color: 'white',
        fontWeight: 700,
        fontSize: '1rem',
    },
    cardBtn: {
        width: '100%',
        padding: '1rem',
        borderRadius: '12px',
        backgroundColor: '#009EE3',
        color: 'white',
        fontWeight: 700,
        fontSize: '1rem',
    },
    backContainer: {
        padding: '1rem 2rem',
        borderTop: '1px solid #eee',
    },
    backBtn: {
        background: 'none',
        color: 'var(--text-muted)',
        fontWeight: 600,
        fontSize: '0.9rem',
    },
    selectionView: {
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    sectionTitle: {
        fontSize: '1.2rem',
        marginBottom: '1rem',
        color: 'var(--text)',
        textAlign: 'center',
    },
    methodOption: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.5rem',
        borderRadius: '15px',
        border: '1px solid #eee',
        backgroundColor: '#fff',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
    },
    methodIcon: {
        fontSize: '2rem',
    },
    methodDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem',
    }
};

export default CartSidebar;
