import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import MercadoPagoBtn from './MercadoPagoBtn';
import { MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { locationsData, getClosestBranch } from '../data/locations';

const CartSidebar = () => {
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        updateQuantity,
        removeFromCart,
        cartTotal,
        selectedBranch,
        setSelectedBranch
    } = useCart();

    const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'delivery', 'selection', 'mercadopago'
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [deliveryMode, setDeliveryMode] = useState('local'); // 'local' or 'delivery'
    const [deliveryAddress, setDeliveryAddress] = useState('');

    const handleWhatsAppCheckout = (methodOverride = null) => {
        const method = methodOverride || paymentMethod || 'WhatsApp';
        const methodText = method === 'cash' ? 'Pago en Efectivo' : method === 'terminal' ? 'Pago con Terminal' : 'Pedido de WhatsApp';

        let locText = "";
        if (deliveryMode === 'delivery') {
            locText = `Envio a Domicilio: ${deliveryAddress}\nSucursal Asignada: ${selectedBranch?.name || 'No asignada'}`;
        } else {
            locText = `Para recoger en sucursal: ${selectedBranch?.name || 'No seleccionada'}`;
        }

        const phone = "523312345678"; // Reemplazo a número simulado
        const itemsList = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
        const text = encodeURIComponent(`¡Hola Patrona!\nMe gustaría hacer un pedido:\n\n${itemsList}\n\nTotal: $${cartTotal.toFixed(2)}\nMetodo de Pago: ${methodText}\nUbicación:\n${locText}\n\nMuchas gracias.`);
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
                const closest = getClosestBranch(latitude, longitude);
                if (closest) {
                    setSelectedBranch(closest);
                }
                const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
                setDeliveryAddress(mapsLink);
            },
            (error) => {
                alert("No pudimos acceder a tu ubicación o denegaste el permiso. Escribe tu dirección manualmente.");
            },
            { enableHighAccuracy: true }
        );
    };

    const renderCheckoutContent = () => {
        if (cart.length === 0) {
            return <div style={styles.emptyMsg}>Tu carrito está vacío</div>;
        }

        switch (checkoutStep) {
            case 'cart':
                return (
                    <>
                        {cart.map((item) => (
                            <div key={item.id} style={styles.item}>
                                <img src={item.image} alt={item.name} style={styles.itemImage} />
                                <div style={styles.itemInfo}>
                                    <h4 style={styles.itemName}>{item.name}</h4>
                                    <span style={styles.itemPrice}>${item.price.toFixed(2)}</span>
                                    <div style={styles.qtyControls}>
                                        <button onClick={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>-</button>
                                        <span style={{ color: 'var(--accent)' }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>+</button>
                                        <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                );
            case 'delivery':
                return (
                    <div style={styles.selectionView}>
                        <h4 style={styles.sectionTitle}>Método de Entrega</h4>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <button
                                onClick={() => {
                                    setDeliveryMode('local');
                                    // Pre-select first branch if none selected
                                    if (!selectedBranch) setSelectedBranch(locationsData[0]);
                                }}
                                style={{
                                    ...styles.deliveryToggleBtn,
                                    borderColor: deliveryMode === 'local' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
                                    color: deliveryMode === 'local' ? 'var(--accent)' : 'var(--text-muted)'
                                }}
                            >
                                Recoger Local
                            </button>
                            <button
                                onClick={() => setDeliveryMode('delivery')}
                                style={{
                                    ...styles.deliveryToggleBtn,
                                    borderColor: deliveryMode === 'delivery' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
                                    color: deliveryMode === 'delivery' ? 'var(--accent)' : 'var(--text-muted)'
                                }}
                            >
                                A Domicilio
                            </button>
                        </div>

                        {deliveryMode === 'local' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>SELECCIONA SUCURSAL:</label>
                                <select
                                    style={styles.deliveryInput}
                                    value={selectedBranch?.id || ''}
                                    onChange={(e) => {
                                        const branch = locationsData.find(b => b.id === parseInt(e.target.value));
                                        setSelectedBranch(branch);
                                    }}
                                >
                                    {locationsData.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                                    ))}
                                </select>
                            </motion.div>
                        )}

                        {deliveryMode === 'delivery' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <input
                                    type="text"
                                    placeholder="Tu dirección completa..."
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    style={styles.deliveryInput}
                                />
                                <button onClick={handleLocationRequest} style={{ ...styles.locationBtn, marginTop: '1rem' }}>
                                    <MapPin size={16} /> USAR MI UBICACIÓN
                                </button>
                                {selectedBranch && deliveryAddress && (
                                    <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--accent)', textAlign: 'center' }}>
                                        Enviaremos tu pedido desde: <br /><strong>{selectedBranch.name}</strong>
                                    </p>
                                )}
                            </motion.div>
                        )}

                        <button
                            style={{ ...styles.primaryBtn, marginTop: '2rem' }}
                            onClick={() => {
                                if (deliveryMode === 'local' && !selectedBranch) {
                                    setSelectedBranch(locationsData[0]);
                                }
                                setCheckoutStep('selection');
                            }}
                        >
                            CONTINUAR
                        </button>
                    </div>
                );
            case 'selection':
                return (
                    <div style={styles.selectionView}>
                        <h4 style={styles.sectionTitle}>Método de Pago</h4>
                        <button style={styles.methodOption} onClick={() => handleWhatsAppCheckout('cash')}>
                            <Banknote size={24} />
                            <div style={styles.methodDetails}>
                                <span>EFECTIVO</span>
                                <span style={styles.methodDetailsSmall}>Paga al recibir / recoger</span>
                            </div>
                        </button>
                        <button style={styles.methodOption} onClick={() => handleWhatsAppCheckout('terminal')}>
                            <CreditCard size={24} />
                            <div style={styles.methodDetails}>
                                <span>TARJETA (TERMINAL)</span>
                                <span style={styles.methodDetailsSmall}>Solo entregas locales / recoger</span>
                            </div>
                        </button>
                        <button
                            style={{ ...styles.methodOption, borderColor: 'var(--primary)' }}
                            onClick={() => setCheckoutStep('mercadopago')}
                        >
                            <TabletSmartphone size={24} color="var(--primary)" />
                            <div style={styles.methodDetails}>
                                <span>PAGO ONLINE</span>
                                <span style={styles.methodDetailsSmall}>Mercado Pago (Tarjeta/Transferencia)</span>
                            </div>
                        </button>
                    </div>
                );
            case 'mercadopago':
                return (
                    <div style={styles.selectionView}>
                        <h4 style={styles.sectionTitle}>Finalizar Pago Online</h4>
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <MercadoPagoBtn cart={cart} total={cartTotal} />
                            <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                Serás redirigido a una plataforma segura de pago.
                            </p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={styles.overlay}
                        onClick={() => {
                            setIsCartOpen(false);
                            setCheckoutStep('cart');
                        }}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={styles.sidebar}
                    >
                        <div style={styles.header}>
                            <h3 style={styles.headerTitle}>
                                {checkoutStep === 'mercadopago' ? 'PAGO SEGURO' :
                                    checkoutStep === 'selection' ? 'SELECCIONAR PAGO' :
                                        checkoutStep === 'delivery' ? 'DETALLES DE ENTREGA' : 'TU CARRITO'}
                            </h3>
                            <button onClick={() => {
                                setIsCartOpen(false);
                                setCheckoutStep('cart');
                            }} style={styles.closeBtn}><X size={24} /></button>
                        </div>

                        <div style={styles.itemsList}>
                            {renderCheckoutContent()}
                        </div>

                        {cart.length > 0 && checkoutStep === 'cart' && (
                            <div style={styles.checkout}>
                                <div style={styles.totalRow}>
                                    <span style={{ color: 'var(--text-muted)', letterSpacing: '0.2em', fontSize: '0.8rem' }}>TOTAL</span>
                                    <span style={styles.totalAmount}>${cartTotal.toFixed(2)}</span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={styles.primaryBtn}
                                    onClick={() => setCheckoutStep('delivery')}
                                >
                                    PROCEDER AL PAGO
                                </motion.button>
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
                                    ← VOLVER
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 998,
        backdropFilter: 'blur(30px)',
    },
    sidebar: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '480px',
        backgroundColor: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(50px)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid rgba(232, 208, 159, 0.1)',
        padding: '4rem 3.5rem',
        boxShadow: '-20px 0 80px rgba(0,0,0,0.8)',
    },
    header: {
        paddingBottom: '2.5rem',
        borderBottom: '1px solid rgba(232, 208, 159, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    headerTitle: {
        fontSize: '1.6rem',
        fontFamily: 'var(--font-display)',
        color: 'var(--accent)',
        fontWeight: 400,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--accent)',
        cursor: 'pointer',
        padding: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        transition: 'var(--transition)',
        opacity: 0.7,
    },
    itemsList: {
        flex: 1,
        overflowY: 'auto',
        padding: '1rem 0',
        scrollbarWidth: 'none',
    },
    emptyMsg: {
        textAlign: 'center',
        paddingTop: '8rem',
        color: 'var(--text-muted)',
        fontSize: '1.1rem',
        fontWeight: 200,
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
    },
    item: {
        display: 'flex',
        gap: '1.8rem',
        padding: '2.5rem 0',
        borderBottom: '1px solid rgba(232, 208, 159, 0.05)',
        alignItems: 'center',
    },
    itemImage: {
        width: '90px',
        height: '90px',
        objectFit: 'cover',
        borderRadius: '0.5rem',
        border: '1px solid rgba(232, 208, 159, 0.1)',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: '1.2rem',
        fontFamily: 'var(--font-display)',
        color: 'var(--accent)',
        marginBottom: '0.5rem',
        fontWeight: 400,
        letterSpacing: '0.02em',
    },
    itemPrice: {
        fontSize: '0.95rem',
        color: 'var(--primary)',
        fontWeight: 700,
        fontFamily: 'var(--font-sans)',
    },
    qtyControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginTop: '1.2rem',
    },
    qtyBtn: {
        width: '28px',
        height: '28px',
        border: '1px solid rgba(232, 208, 159, 0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(232, 208, 159, 0.05)',
        color: 'var(--accent)',
        cursor: 'pointer',
        fontSize: '0.9rem',
        borderRadius: '0.3rem',
        transition: 'var(--transition)',
    },
    removeBtn: {
        background: 'none',
        border: 'none',
        color: 'rgba(232, 208, 159, 0.3)',
        padding: '0.5rem',
        cursor: 'pointer',
        marginLeft: 'auto',
        transition: 'var(--transition)',
    },
    checkout: {
        paddingTop: '3rem',
        borderTop: '1px solid rgba(232, 208, 159, 0.1)',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
    },
    totalAmount: {
        fontSize: '2rem',
        color: 'var(--accent)',
        fontFamily: 'var(--font-display)',
        fontWeight: 400,
    },
    primaryBtn: {
        width: '100%',
        padding: '1.5rem',
        backgroundColor: 'var(--accent)',
        color: 'var(--bg-color)',
        fontWeight: 800,
        fontSize: '0.8rem',
        letterSpacing: '0.3em',
        cursor: 'pointer',
        border: 'none',
        textTransform: 'uppercase',
        transition: 'var(--transition)',
    },
    backContainer: {
        paddingTop: '2rem',
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
        cursor: 'pointer',
        textTransform: 'uppercase',
        opacity: 0.6,
        transition: 'var(--transition)',
    },
    selectionView: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '1.5rem 0',
    },
    sectionTitle: {
        fontSize: '1.3rem',
        color: 'var(--accent)',
        marginBottom: '2.5rem',
        textAlign: 'center',
        letterSpacing: '0.05em',
        fontFamily: 'var(--font-display)',
        fontWeight: 400,
    },
    methodOption: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        padding: '2rem',
        border: '1px solid rgba(232, 208, 159, 0.1)',
        backgroundColor: 'rgba(232, 208, 159, 0.03)',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        color: 'var(--accent)',
        transition: 'var(--transition)',
    },
    methodDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        textAlign: 'left',
    },
    methodDetailsSmall: {
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        letterSpacing: '0.05em',
    },
    deliveryToggleBtn: {
        flex: 1,
        padding: '1.2rem',
        border: '1px solid rgba(232, 208, 159, 0.1)',
        backgroundColor: 'rgba(232, 208, 159, 0.03)',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        transition: 'var(--transition)',
    },
    deliveryInput: {
        width: '100%',
        padding: '1.5rem',
        border: '1px solid rgba(232, 208, 159, 0.1)',
        backgroundColor: 'rgba(232, 208, 159, 0.03)',
        color: 'var(--accent)',
        fontSize: '0.95rem',
        outline: 'none',
        fontFamily: 'var(--font-sans)',
        borderRadius: '0.5rem',
    },
    locationBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem',
        backgroundColor: 'transparent',
        color: 'var(--primary)',
        border: '1px solid var(--primary)',
        padding: '1.2rem',
        fontSize: '0.75rem',
        fontWeight: 800,
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        width: '100%',
        transition: 'var(--transition)',
    }
};

export default CartSidebar;
