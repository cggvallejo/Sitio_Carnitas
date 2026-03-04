import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import MercadoPagoBtn from './MercadoPagoBtn';
import { CreditCard, Banknote, TabletSmartphone, Trash2, ShoppingCart, MapPin } from 'lucide-react';

const CartSidebar = () => {
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        updateQuantity,
        removeFromCart,
        cartTotal
    } = useCart();

    const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'delivery', 'selection', 'mercadopago'
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [deliveryMode, setDeliveryMode] = useState('local'); // 'local' or 'delivery'
    const [deliveryAddress, setDeliveryAddress] = useState('');

    const handleWhatsAppCheckout = (methodOverride = null) => {
        const method = methodOverride || paymentMethod || 'WhatsApp';
        const methodText = method === 'cash' ? 'Pago en Efectivo' : method === 'terminal' ? 'Pago con Terminal' : 'Pedido de WhatsApp';

        const locText = deliveryMode === 'delivery' ? `Envío a: ${deliveryAddress}` : 'Para recoger en sucursal';

        const phone = "523312345678"; // Reemplazo a número simulado
        const itemsList = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
        const text = encodeURIComponent(`¡Hola Patrón!\nMe gustaría hacer un pedido:\n\n${itemsList}\n\nTotal: $${cartTotal.toFixed(2)}\nMetodo de Pago: ${methodText}\nUbicación: ${locText}\n\nMuchas gracias.`);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    };

    const handleLocationRequest = () => {
        if (!navigator.geolocation) {
            alert("Tu dispositivo no soporta geolocalización. Por favor, escribe tu dirección manualmente.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
                setDeliveryAddress(mapsLink);
            },
            (error) => {
                alert("No pudimos acceder a tu ubicación o denegaste el permiso. Escribe tu dirección manualmente.");
            },
            { enableHighAccuracy: true }
        );
    };

    if (!isCartOpen) return null;

    const renderCheckoutContent = () => {
        if (checkoutStep === 'mercadopago') {
            return <MercadoPagoBtn amount={cartTotal} />;
        }

        if (checkoutStep === 'delivery') {
            return (
                <div style={styles.selectionView}>
                    <h4 style={styles.sectionTitle}>¿Dónde te entregamos?</h4>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <button
                            style={{ ...styles.deliveryToggleBtn, backgroundColor: deliveryMode === 'local' ? 'var(--primary)' : '#f5f5f5', color: deliveryMode === 'local' ? 'white' : '#333' }}
                            onClick={() => setDeliveryMode('local')}
                        >
                            Pasar a recoger
                        </button>
                        <button
                            style={{ ...styles.deliveryToggleBtn, backgroundColor: deliveryMode === 'delivery' ? 'var(--primary)' : '#f5f5f5', color: deliveryMode === 'delivery' ? 'white' : '#333' }}
                            onClick={() => setDeliveryMode('delivery')}
                        >
                            A domicilio
                        </button>
                    </div>

                    {deliveryMode === 'delivery' && (
                        <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.3s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: 'bold', margin: 0 }}>Dirección de entrega:</p>
                                <button
                                    onClick={handleLocationRequest}
                                    style={styles.locationBtn}
                                    title="Usar mi ubicación actual"
                                >
                                    <MapPin size={16} /> GPS Actual
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Ej: Calle Juárez 123, Col. Centro"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                style={styles.deliveryInput}
                            />
                        </div>
                    )}

                    <button
                        style={{ ...styles.cardBtn, opacity: (deliveryMode === 'delivery' && !deliveryAddress.trim()) ? 0.5 : 1 }}
                        disabled={deliveryMode === 'delivery' && !deliveryAddress.trim()}
                        onClick={() => setCheckoutStep('selection')}
                    >
                        Continuar al Pago
                    </button>
                </div>
            );
        }

        if (checkoutStep === 'selection') {
            return (
                <div style={styles.selectionView}>
                    <h4 style={styles.sectionTitle}>¿Cómo deseas pagar?</h4>
                    <button
                        style={styles.methodOption}
                        onClick={() => setCheckoutStep('mercadopago')}
                    >
                        <span style={styles.methodIcon}><CreditCard size={32} color="var(--primary)" /></span>
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
                        <span style={styles.methodIcon}><Banknote size={32} color="var(--primary)" /></span>
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
                        <span style={styles.methodIcon}><TabletSmartphone size={32} color="var(--primary)" /></span>
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
                <div style={styles.emptyMsg}>
                    <ShoppingCart size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>Tu carrito está vacío</p>
                </div>
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
                        <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}><Trash2 size={18} color="#e74c3c" /></button>
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
                            checkoutStep === 'selection' ? 'Seleccionar Pago' :
                                checkoutStep === 'delivery' ? 'Detalles de Entrega' : 'Tu Carrito'}
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
                                onClick={() => setCheckoutStep('delivery')}
                            >
                                Finalizar Pedido
                            </button>
                        </div>
                    </div>
                )}

                {checkoutStep !== 'cart' && (
                    <div style={styles.backContainer}>
                        <button
                            onClick={() => {
                                if (checkoutStep === 'mercadopago') setCheckoutStep('selection');
                                else if (checkoutStep === 'selection') setCheckoutStep('delivery');
                                else setCheckoutStep('cart');
                            }}
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
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 999,
        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.4s ease forwards',
        borderLeft: '1px solid rgba(255, 255, 255, 0.5)',
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
        borderTop: '1px solid rgba(0,0,0,0.05)',
        backgroundColor: 'rgba(250, 250, 250, 0.5)',
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
    },
    deliveryToggleBtn: {
        flex: 1, padding: '0.8rem', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif'
    },
    deliveryInput: {
        width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #ddd', fontFamily: 'Outfit, sans-serif', fontSize: '1rem', outline: 'none'
    },
    locationBtn: {
        display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#e8f4fd', color: '#0984e3', border: '1px solid #74b9ff', borderRadius: '10px', padding: '0.4rem 0.6rem', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s'
    }
};

export default CartSidebar;
