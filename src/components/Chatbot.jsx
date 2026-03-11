import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { MessageCircle, X, CreditCard, Banknote, SmartphoneNfc, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CheckoutProBtn from './CheckoutProBtn';
import porkbotImg from '../assets/images/porkbot.png';
import { locationsData, getClosestBranch } from '../data/locations';

const Chatbot = () => {
    const { addToCart, setIsCartOpen } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, role: 'bot', text: "¡Oink, oink! 🐷 Soy Porkbot. ¿Qué se te antoja de nuestro menú hoy?" }
    ]);
    const [addressInput, setAddressInput] = useState('');
    const scrollRef = useRef(null);

    // Estado del bot
    const [orderState, setOrderState] = useState('MENU'); // MENU, LOCATION, PAYMENT, CONFIRM
    const [currentOrder, setCurrentOrder] = useState({ items: [], location: '', payment: '' });

    // Menú completo organizado por categorías
    const menuOptions = [
        // TACOS ($35)
        { label: "🌮 Taco de Maciza - $35", id: 100, price: 35 },
        { label: "🌮 Taco de Cuero - $35", id: 104, price: 35 },
        { label: "🌮 Taco de Buche - $35", id: 108, price: 35 },
        { label: "🌮 Taco de Surtido - $35", id: 112, price: 35 },
        { label: "🌮 Taco de Cachete - $35", id: 116, price: 35 },
        { label: "🌮 Taco de Trompa - $35", id: 120, price: 35 },
        { label: "🌮 Taco de Oreja - $35", id: 124, price: 35 },
        { label: "🌮 Taco de Chamorro - $35", id: 128, price: 35 },
        // TORTAS ($85)
        { label: "🥖 Torta de Maciza - $85", id: 101, price: 85 },
        { label: "🥖 Torta de Cuero - $85", id: 105, price: 85 },
        { label: "🥖 Torta de Buche - $85", id: 109, price: 85 },
        { label: "🥖 Torta Surtida - $85", id: 113, price: 85 },
        { label: "🥖 Torta de Cachete - $85", id: 117, price: 85 },
        { label: "🥖 Torta de Trompa - $85", id: 121, price: 85 },
        { label: "🥖 Torta de Oreja - $85", id: 125, price: 85 },
        { label: "🥖 Torta de Chamorro - $85", id: 129, price: 85 },
        // GORDITAS ($55)
        { label: "🫓 Gordita de Maciza - $55", id: 102, price: 55 },
        { label: "🫓 Gordita de Cuero - $55", id: 106, price: 55 },
        { label: "🫓 Gordita de Surtido - $55", id: 114, price: 55 },
        { label: "🫓 Gordita de Chamorro - $55", id: 130, price: 55 },
        // KILOS ($450)
        { label: "⚖️ 1kg Maciza - $450", id: 103, price: 450 },
        { label: "⚖️ 1kg Chamorro - $450", id: 131, price: 450 },
        { label: "⚖️ 1kg Surtido - $450", id: 115, price: 450 },
        // BEBIDAS (populares en Cancún, Q.Roo)
        { label: "🥤 Coca-Cola - $25",             id: 10,  price: 25 },
        { label: "🥤 Pepsi - $25",                 id: 200, price: 25 },
        { label: "🥤 Sprite - $25",                id: 201, price: 25 },
        { label: "🥤 Jarritos Tamarindo - $25",    id: 202, price: 25 },
        { label: "🥤 Jarritos Mandarina - $25",    id: 203, price: 25 },
        { label: "🥤 Manzanita Sol - $25",         id: 204, price: 25 },
        { label: "🥤 Sidral Mundet - $25",         id: 205, price: 25 },
        { label: "🥤 Boing Guayaba - $25",         id: 206, price: 25 },
        { label: "🥥 Agua de Coco Natural - $30",  id: 207, price: 30 },
        { label: "🌸 Agua de Horchata - $30",      id: 11,  price: 30 },
        { label: "🌺 Agua de Jamaica - $30",       id: 208, price: 30 },
        // COMPLEMENTOS
        { label: "🌶️ Salsa Especial 250ml - $35", id: 6, price: 35 },
    ];

    // Categorías para el menú del chatbot
    const menuCategories = [
        { label: "🌮 Ver Tacos ($35)", category: 'Tacos' },
        { label: "🥖 Ver Tortas ($85)", category: 'Tortas' },
        { label: "🫓 Ver Gorditas ($55)", category: 'Gorditas' },
        { label: "⚖️ Ver Kilos ($450)", category: 'Kilos' },
        { label: "🥤 Ver Bebidas", category: 'Bebidas' },
    ];

    const [menuFilter, setMenuFilter] = useState(null); // null = mostrar categorias, 'Tacos'/etc = filtrar

    const getOrderTotal = () => currentOrder.items.reduce((sum, item) => sum + item.price, 0);

    const getFilteredMenuOptions = () => {
        if (!menuFilter) return [];
        const catMap = {
            'Tacos': menuOptions.filter(o => o.label.startsWith('🌮')),
            'Tortas': menuOptions.filter(o => o.label.startsWith('🥖')),
            'Gorditas': menuOptions.filter(o => o.label.startsWith('🫓')),
            'Kilos': menuOptions.filter(o => o.label.startsWith('⚖️')),
            'Bebidas': menuOptions.filter(o => 
                o.label.startsWith('🥤') || 
                o.label.startsWith('🥥') || 
                o.label.startsWith('🌸') || 
                o.label.startsWith('🌺')
            ),
        };
        return catMap[menuFilter] || [];
    };

    const getQuickReplies = () => {
        if (orderState === 'MENU') {
            if (menuFilter) {
                return [
                    ...getFilteredMenuOptions().map(o => o.label),
                    '↩ Ver categorias',
                    'Total a pagar'
                ];
            }
            return [
                ...menuCategories.map(c => c.label),
                'Total y Pagar'
            ];
        }
        if (orderState === 'LOCATION') {
            return ["Local", "Para Llevar"];
        }
        if (orderState === 'SELECT_BRANCH') {
            return locationsData.map(loc => loc.name);
        }
        if (orderState === 'PAYMENT') {
            return ["Efectivo", "Tarjeta / Mercado Pago"];
        }
        if (orderState === 'PAYMENT_CARD_OPTIONS') {
            return ["Pagar aquí (Seguro)", "Terminal a Domicilio"];
        }
        if (orderState === 'CONFIRM') {
            return ["Enviar a WhatsApp", "Cancelar Pedido"];
        }
        if (orderState === 'MP_CHECKOUT') {
            return ["Cancelar Pago"];
        }
        return [];
    };

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const addMessage = (role, text) => {
        setMessages(prev => [...prev, { id: Date.now(), role, text }]);
    };

    const handleReply = (replyText) => {
        addMessage('user', replyText);

        setTimeout(() => {
        if (orderState === 'MENU') {
                if (replyText === 'Total y Pagar') {
                    if (currentOrder.items.length === 0) {
                        addMessage('bot', '¡Tu pedido está vacío! Elige una categoría para ver el menú.');
                    } else {
                        setOrderState('LOCATION');
                        addMessage('bot', `Llevas $${getOrderTotal().toFixed(2)}. ¡Excelente! ¿Para comer aquí o te lo preparamos para llevar?`);
                    }
                    return;
                }

                if (replyText === '↩ Ver categorias') {
                    setMenuFilter(null);
                    addMessage('bot', '¿Qué categoría quieres ver?');
                    return;
                }

                // Ver si es una categoría
                const catOption = menuCategories.find(c => c.label === replyText);
                if (catOption) {
                    setMenuFilter(catOption.category);
                    const items = menuOptions.filter(o => {
                        const catMap = {
                            'Tacos': '🌮', 'Tortas': '🥖', 'Gorditas': '🫓', 'Kilos': '⚖️'
                        };
                        return catOption.category === 'Bebidas'
                            ? (o.label.startsWith('🥤') || o.label.startsWith('🍷') || o.label.startsWith('🌶️'))
                            : o.label.startsWith(catMap[catOption.category] || '');
                    });
                    addMessage('bot', `¡Aquí están nuestros ${catOption.category}! ¿Cuál se te antoja? 🐷`);
                    return;
                }

                // Buscar el producto seleccionado
                const option = menuOptions.find(o => o.label === replyText);
                if (option) {
                    const prodDb = products.find(p => p.id === option.id);
                    if (prodDb) {
                        addToCart(prodDb, false);
                        const newItems = [...currentOrder.items, { name: prodDb.name, price: prodDb.price }];
                        const newTotal = newItems.reduce((sum, item) => sum + item.price, 0);
                        setCurrentOrder(prevOrder => ({ ...prevOrder, items: newItems }));
                        addMessage('bot', `¡Agregado ${prodDb.name}! Total de la cuenta = $${newTotal.toFixed(2)}. ¿Agregás algo más?`);
                    }
                }
            }
            else if (orderState === 'LOCATION') {
                if (replyText === 'Para Llevar') {
                    setOrderState('ADDRESS_INPUT');
                    addMessage('bot', '¡Oink! Vamos hasta tu casa 🚗🐷. Por favor, escribe tu calle, número y colonia:');
                } else {
                    setOrderState('SELECT_BRANCH');
                    addMessage('bot', '¡Excelente! ¿En cuál de nuestras sucursales nos visitas hoy?');
                }
            }
            else if (orderState === 'SELECT_BRANCH') {
                setCurrentOrder({ ...currentOrder, location: `Recoger en: ${replyText}` });
                setOrderState('PAYMENT');
                addMessage('bot', `¡Perfecto, te esperamos en ${replyText}! ¿Cómo te gustaría pagar?`);
            }
            else if (orderState === 'PAYMENT') {
                if (replyText === 'Tarjeta / Mercado Pago') {
                    setOrderState('PAYMENT_CARD_OPTIONS');
                    addMessage('bot', '¡Entendido! ¿Prefieres pagar ahora mismo de forma segura o enviamos una terminal a tu domicilio?');
                } else {
                    setCurrentOrder({ ...currentOrder, payment: replyText });
                    setOrderState('CONFIRM');
                    const itemsList = currentOrder.items.map(i => `- ${i.name}`).join('\n');
                    addMessage('bot', `Aquí está tu resumen oink-creíble:\n\n${itemsList}\nTotal: $${getOrderTotal().toFixed(2)}\nEntrega: ${currentOrder.location}\nPago: ${replyText}\n\n¿Confirmamos el pedido?`);
                }
            }
            else if (orderState === 'PAYMENT_CARD_OPTIONS') {
                setCurrentOrder({ ...currentOrder, payment: replyText });

                if (replyText === 'Pagar aquí (Seguro)') {
                    setOrderState('MP_CHECKOUT');
                    addMessage('bot', `Total a pagar: $${getOrderTotal().toFixed(2)}. Abriendo la bóveda de cerdito segura... 🐷💳`);
                } else {
                    setOrderState('CONFIRM');
                    const itemsList = currentOrder.items.map(i => `- ${i.name}`).join('\n');
                    addMessage('bot', `Aquí está tu resumen oink-creíble:\n\n${itemsList}\nTotal: $${getOrderTotal().toFixed(2)}\nEntrega: ${currentOrder.location}\nPago: Terminal a Domicilio\n\n¿Confirmamos el pedido?`);
                }
            }
            else if (orderState === 'MP_CHECKOUT') {
                if (replyText === 'Cancelar Pago') {
                    addMessage('bot', 'Pago cancelado. ¿Empezamos de nuevo?');
                    setOrderState('MENU');
                    setCurrentOrder({ items: [], location: '', payment: '' });
                }
            }
            else if (orderState === 'CONFIRM') {
                if (replyText === 'Enviar a WhatsApp') {
                    addMessage('bot', '¡Tu orden va volando! 🐽 Abriendo WhatsApp...');

                    const itemsList = currentOrder.items.map(i => `- ${i.name}`).join('\n');
                    const wpMsg = `¡Hola! Vengo de parte de Porkbot 🐷\nMi pedido es:\n\n${itemsList}\nTotal: $${getOrderTotal().toFixed(2)}\n*Para:* ${currentOrder.location}\n*Pago:* ${currentOrder.payment}\n\n¡Gracias!`;

                    setTimeout(() => {
                        window.open(`https://wa.me/523312345678?text=${encodeURIComponent(wpMsg)}`, '_blank');
                        // Reset
                        setOrderState('MENU');
                        setCurrentOrder({ items: [], location: '', payment: '' });
                        addMessage('bot', '¡Listo! ¿Te puedo ayudar con otro pedido?');
                    }, 1500);
                } else {
                    addMessage('bot', '¡No hay problema! Cancelamos esto. ¿Empezamos de nuevo?');
                    setOrderState('MENU');
                    setCurrentOrder({ items: [], location: '', payment: '' });
                }
            }
        }, 600);
    };

    const handleAddressSubmit = () => {
        if (!addressInput.trim()) return;
        addMessage('user', addressInput);

        setTimeout(() => {
            setCurrentOrder(prev => ({ ...prev, location: `Domicilio: ${addressInput}` }));
            setOrderState('PAYMENT');
            addMessage('bot', '¡Anotado! 🐷 ¿Cómo te gustaría pagar?');
            setAddressInput('');
        }, 600);
    };

    const handleLocationRequest = () => {
        if (!navigator.geolocation) {
            addMessage('bot', 'Tu dispositivo no soporta geolocalización. Por favor, escribe tu dirección:');
            return;
        }

        addMessage('bot', '📍 Solicitando tu ubicación actual...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const closest = getClosestBranch(latitude, longitude);
                const branchName = closest ? closest.name : 'Nuestra Sucursal Principal';
                const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;

                addMessage('user', '📍 Ubicación GPS enviada');
                setTimeout(() => {
                    setCurrentOrder(prev => ({ ...prev, location: `Domicilio: GPS (${mapsLink})\nSucursal Asignada: ${branchName}` }));
                    setOrderState('PAYMENT');
                    addMessage('bot', `¡Ubicación exacta recibida! 🐷\nTe enviaremos tu pedido desde ${branchName}.\n¿Cómo te gustaría pagar?`);
                    setAddressInput('');
                }, 600);
            },
            (error) => {
                addMessage('bot', '¡Ups! No pudimos obtener tu ubicación o denegaste el permiso. Por favor, escríbela manualmente:');
            },
            { enableHighAccuracy: true }
        );
    };

    return (
        <div style={styles.chatWrapper}>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setIsCartOpen(false);
                }}
                style={{
                    ...styles.launcher,
                    animation: !isOpen ? 'pulse-soft 2s infinite' : 'none'
                }}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        style={styles.window}
                    >
                        <div style={styles.header}>
                            <div style={styles.botInfo}>
                                <motion.img
                                    src={porkbotImg}
                                    alt="Porkbot Avatar"
                                    style={styles.botAvatarImg}
                                    animate={{ y: [-2, 2, -2] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                />
                                <div>
                                    <h4 style={styles.botName}>Porkbot 🐽</h4>
                                    <small style={styles.botStatus}>En línea y hambriento</small>
                                </div>
                            </div>
                        </div>

                        <div style={styles.messages} ref={scrollRef}>
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        ...styles.messageRow,
                                        justifyContent: msg.role === 'bot' ? 'flex-start' : 'flex-end'
                                    }}
                                >
                                    <div style={{
                                        ...styles.messageBubble,
                                        backgroundColor: msg.role === 'bot' ? 'rgba(255, 255, 255, 0.05)' : 'var(--primary)',
                                        color: msg.role === 'bot' ? 'var(--accent)' : 'var(--bg-color)',
                                        border: msg.role === 'bot' ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                                        borderBottomLeftRadius: msg.role === 'bot' ? '0.2rem' : '1rem',
                                        borderBottomRightRadius: msg.role === 'user' ? '0.2rem' : '1rem',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {orderState === 'MP_CHECKOUT' && (
                                <div style={{ width: '100%', marginTop: '0.5rem', animation: 'fadeIn 0.5s ease-in-out forwards' }}>
                                    <CheckoutProBtn
                                        cart={currentOrder.items.map(i => ({ name: i.name, price: i.price, quantity: 1 }))}
                                        total={getOrderTotal()}
                                    />
                                </div>
                            )}
                        </div>

                        {orderState === 'ADDRESS_INPUT' ? (
                            <div style={styles.addressInputContainer}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleLocationRequest}
                                    style={styles.locationBtn}
                                >
                                    <MapPin size={16} /> Usar mi ubicación GPS actual
                                </motion.button>
                                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                                    <input
                                        type="text"
                                        placeholder="O escribe: Juárez 123..."
                                        value={addressInput}
                                        onChange={(e) => setAddressInput(e.target.value)}
                                        style={styles.addressInput}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddressSubmit();
                                        }}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleAddressSubmit}
                                        style={styles.addressSubmitBtn}
                                    >
                                        Enviar
                                    </motion.button>
                                </div>
                            </div>
                        ) : getQuickReplies().length > 0 && (
                            <div style={styles.quickRepliesContainer}>
                                {getQuickReplies().map((reply, idx) => (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        key={idx}
                                        style={styles.quickReplyBtn}
                                        onClick={() => handleReply(reply)}
                                    >
                                        {reply}
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    chatWrapper: {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        fontFamily: 'var(--font-sans)',
    },
    launcher: {
        width: '65px',
        height: '65px',
        borderRadius: '50%',
        backgroundColor: 'var(--accent)',
        color: 'var(--bg-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    window: {
        position: 'absolute',
        bottom: '85px',
        right: '0',
        width: '380px',
        height: '600px',
        backgroundColor: 'rgba(5, 5, 5, 0.95)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(232, 208, 159, 0.1)',
        borderRadius: '1.2rem',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9)',
    },
    header: {
        padding: '1.5rem 2rem',
        borderBottom: '1px solid rgba(232, 208, 159, 0.1)',
        background: 'linear-gradient(180deg, rgba(232, 208, 159, 0.03) 0%, transparent 100%)',
    },
    botInfo: { display: 'flex', alignItems: 'center', gap: '1.2rem' },
    botAvatarImg: {
        width: '55px',
        height: '55px',
        borderRadius: '50%',
        border: '1px solid var(--accent)',
        objectFit: 'contain',
        backgroundColor: 'rgba(5, 5, 5, 0.8)',
        padding: '5px',
    },
    botName: {
        margin: 0,
        fontSize: '1.2rem',
        fontFamily: 'var(--font-display)',
        color: 'var(--accent)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    },
    botStatus: {
        color: 'var(--primary)',
        fontSize: '0.65rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        fontWeight: 700,
        opacity: 0.8
    },
    messages: {
        flex: 1,
        padding: '1.5rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        scrollbarWidth: 'none',
        scrollBehavior: 'smooth'
    },
    messageRow: { display: 'flex', width: '100%' },
    messageBubble: {
        maxWidth: '85%',
        padding: '1rem 1.2rem',
        fontSize: '0.95rem',
        lineHeight: '1.5',
        borderRadius: '1rem',
        fontWeight: 400,
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    },
    quickRepliesContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '0.8rem 1.2rem',
        borderTop: '1px solid rgba(232, 208, 159, 0.1)',
        backgroundColor: 'rgba(232, 208, 159, 0.02)',
        maxHeight: '220px',
        overflowY: 'auto',
        scrollbarWidth: 'none',
    },
    quickReplyBtn: {
        backgroundColor: 'rgba(232, 208, 159, 0.05)',
        color: 'var(--text-main)',
        border: '1px solid rgba(232, 208, 159, 0.1)',
        padding: '1rem',
        fontSize: '0.75rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: 600,
        letterSpacing: '0.1em',
        borderRadius: '0.8rem',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    addressInputContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        padding: '1.5rem',
        borderTop: '1px solid rgba(232, 208, 159, 0.1)',
    },
    addressInput: {
        width: '100%',
        padding: '0.8rem 1rem',
        border: '1px solid rgba(232, 208, 159, 0.1)',
        backgroundColor: 'rgba(232, 208, 159, 0.03)',
        borderRadius: '0.8rem',
        color: 'var(--accent)',
        fontSize: '0.9rem',
        outline: 'none',
        fontFamily: 'var(--font-sans)',
        transition: 'all 0.3s ease',
    },
    addressSubmitBtn: {
        backgroundColor: 'var(--accent)',
        color: 'var(--bg-color)',
        border: 'none',
        padding: '1rem',
        fontWeight: 700,
        borderRadius: '0.8rem',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontSize: '0.75rem',
        transition: 'all 0.3s ease',
    },
    locationBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem',
        backgroundColor: 'transparent',
        color: 'var(--primary)',
        border: '1px solid var(--primary)',
        padding: '1rem',
        borderRadius: '0.8rem',
        fontWeight: 700,
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontSize: '0.75rem',
        transition: 'all 0.3s ease',
    },
};

export default Chatbot;
