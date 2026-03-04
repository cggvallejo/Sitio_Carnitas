import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { MessageCircle, X, Bot, CreditCard, Banknote, SmartphoneNfc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MercadoPagoBtn from './MercadoPagoBtn';

const Chatbot = () => {
    const { addToCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, role: 'bot', text: "¡Qué onda! Soy el Patrón-Bot. Selecciona una opción del menú para empezar tu pedido:" }
    ]);
    const scrollRef = useRef(null);

    // Estado del bot
    const [orderState, setOrderState] = useState('MENU'); // MENU, LOCATION, PAYMENT, CONFIRM
    const [currentOrder, setCurrentOrder] = useState({ items: [], location: '', payment: '' });

    const menuOptions = [
        { label: "Tacos (x3) - $95", id: "tacos" },
        { label: "Torta Carnitas - $85", id: "torta" },
        { label: "1kg Surtida - $420", id: "kilo_surtida" },
        { label: "Refresco 600ml - $25", id: "refresco" }
    ];

    const getOrderTotal = () => currentOrder.items.reduce((sum, item) => sum + item.price, 0);

    const getQuickReplies = () => {
        if (orderState === 'MENU') {
            return [
                ...menuOptions.map(o => o.label),
                "Total y Pagar"
            ];
        }
        if (orderState === 'LOCATION') {
            return ["Local", "Para Llevar"];
        }
        if (orderState === 'PAYMENT') {
            return ["Efectivo", "Tarjeta / Mercado Pago"];
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
                        addMessage('bot', '¡Tu pedido está vacío! ¿Qué te preparamos?');
                    } else {
                        setOrderState('LOCATION');
                        addMessage('bot', `Llevas $${getOrderTotal().toFixed(2)}. ¡Excelente! ¿Para comer aquí o te lo preparamos para llevar?`);
                    }
                    return;
                }

                // Buscar el producto seleccionado
                const option = menuOptions.find(o => o.label === replyText);
                if (option) {
                    const prodDb = products.find(p => p.id === option.id || p.name.includes(replyText.split(' -')[0].replace(/[^a-zA-Z]/g, '').trim()));
                    if (prodDb) {
                        addToCart(prodDb);
                        const newItems = [...currentOrder.items, { name: prodDb.name, price: prodDb.price }];
                        setCurrentOrder({ ...currentOrder, items: newItems });
                        addMessage('bot', `¡Agregado ${prodDb.name}! Llevas ${newItems.length} producto(s). ¿Algo más?`);
                    } else {
                        addMessage('bot', '¡Anotado! 👍 ¿Te agrego algo más o ya terminamos el pedido?');
                        const newItems = [...currentOrder.items, { name: replyText, price: 0 }];
                        setCurrentOrder({ ...currentOrder, items: newItems });
                    }
                }
            }
            else if (orderState === 'LOCATION') {
                setCurrentOrder({ ...currentOrder, location: replyText });
                setOrderState('PAYMENT');
                addMessage('bot', '¡Perfecto! ¿Cómo te gustaría pagar?');
            }
            else if (orderState === 'PAYMENT') {
                setCurrentOrder({ ...currentOrder, payment: replyText });

                if (replyText === 'Tarjeta / Mercado Pago') {
                    setOrderState('MP_CHECKOUT');
                    addMessage('bot', `Total a pagar: $${getOrderTotal().toFixed(2)}. Cargando pasarela segura...`);
                } else {
                    setOrderState('CONFIRM');
                    const itemsList = currentOrder.items.map(i => `- ${i.name}`).join('\n');
                    addMessage('bot', `Aquí está tu resumen:\n\n${itemsList}\nTotal: $${getOrderTotal().toFixed(2)}\nEntrega: ${currentOrder.location}\nPago: ${replyText}\n\n¿Confirmamos el pedido?`);
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
                    addMessage('bot', '¡Tu orden va en camino! Abriendo WhatsApp...');

                    const itemsList = currentOrder.items.map(i => `- ${i.name}`).join('\n');
                    const wpMsg = `¡Hola Patrón!\nMi pedido es:\n\n${itemsList}\nTotal: $${getOrderTotal().toFixed(2)}\n*Para:* ${currentOrder.location}\n*Pago:* ${currentOrder.payment}\n\n¡Gracias!`;

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

    return (
        <div style={styles.chatWrapper}>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
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
                                <span style={styles.botAvatar}>
                                    <Bot size={24} color="white" />
                                </span>
                                <div>
                                    <h4 style={styles.botName}>Patrón-Bot</h4>
                                    <small style={styles.botStatus}>En línea</small>
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
                                        backgroundColor: msg.role === 'bot' ? '#f0f0f0' : 'var(--primary)',
                                        color: msg.role === 'bot' ? '#333' : 'white',
                                        borderRadius: msg.role === 'bot' ? '0 15px 15px 15px' : '15px 15px 0 15px',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {orderState === 'MP_CHECKOUT' && (
                                <div style={{ width: '100%', marginTop: '1rem', animation: 'fadeIn 0.5s ease-in-out forwards' }}>
                                    <MercadoPagoBtn amount={getOrderTotal()} />
                                </div>
                            )}
                        </div>

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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    chatWrapper: { position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, fontFamily: 'Outfit, sans-serif' },
    launcher: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 20px rgba(0,0,0,0.2)', border: 'none', cursor: 'pointer' },
    window: { position: 'absolute', bottom: '80px', right: '0', width: '340px', height: '500px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    header: { padding: '1rem', backgroundColor: 'var(--primary)', color: 'white' },
    botInfo: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
    botAvatar: { fontSize: '1.8rem', backgroundColor: 'rgba(255,255,255,0.2)', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' },
    botName: { margin: 0, fontSize: '1.1rem', fontWeight: 'bold' },
    botStatus: { opacity: 0.9, fontSize: '0.8rem' },
    messages: { flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', backgroundColor: '#fdfdfd' },
    messageRow: { display: 'flex', width: '100%' },
    messageBubble: { maxWidth: '85%', padding: '0.8rem 1rem', fontSize: '0.95rem', lineHeight: '1.4', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    quickRepliesContainer: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '1rem', backgroundColor: '#fafafa', borderTop: '1px solid #eee', justifyContent: 'center' },
    quickReplyBtn: { backgroundColor: '#fdeee8', color: 'var(--primary)', border: '1px solid rgba(230, 81, 0, 0.3)', borderRadius: '15px', padding: '0.6rem 1rem', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold', width: '100%' }
};

export default Chatbot;
