import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const Chatbot = () => {
    const [orderState, setOrderState] = useState('IDLE'); // IDLE, ASKING_QUANTITY, ASKING_BEVERAGES, ASKING_LOCATION, ASKING_PAYMENT, CONFIRMING
    const [currentOrder, setCurrentOrder] = useState({ products: [], location: '', paymentMethod: '' });
    const [lastAction, setLastAction] = useState(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = inputValue;
        setInputValue('');

        // Lógica de respuesta del bot
        setTimeout(() => {
            processBotResponse(currentInput);
        }, 600);
    };

    const addBotMessage = (text) => {
        setMessages(prev => [...prev, { id: Date.now(), text, sender: 'bot' }]);
    };

    const processBotResponse = (inputText) => {
        const text = inputText.toLowerCase();
        let botText = "";

        // Máquina de estados
        switch (orderState) {
            case 'IDLE':
                if (text.includes('hola') || text.includes('buenos dias')) {
                    botText = "¡Hola! Soy el Patrón-Bot 🤠. ¿Qué se te antoja hoy? Tengo tacos, tortas, carnitas por kilo y bebidas.";
                } else if (text.includes('taco') || text.includes('torta') || text.includes('kilo')) {
                    const foundProduct = products.find(p => text.includes(p.name.toLowerCase().split(' ')[0]));
                    if (foundProduct) {
                        setLastAction({ type: 'ADD_PRODUCT', product: foundProduct });
                        setOrderState('ASKING_QUANTITY');
                        botText = `¡Excelente elección! ¿Cuántas órdenes de ${foundProduct.name} te gustaría pedir?`;
                    } else {
                        botText = "¿Qué tipo de taco o platillo te gustaría? (Maciza, Surtida, Cuerito, Torta)";
                    }
                } else if (text.includes('menu')) {
                    botText = "Nuestro menú incluye: Tacos (Maciza, Surtida, Cuerito), Tortas, Carnitas por Kilo y Bebidas. ¿Qué te gustaría ordenar?";
                } else {
                    botText = "Perdona, no te entendí bien. ¿Quieres pedir unos tacos, ver el menú o prefieres que te ayude a finalizar tu orden?";
                }
                break;

            case 'ASKING_QUANTITY':
                const quantity = parseInt(text.match(/\d+/) || [1]);
                if (!isNaN(quantity) && quantity > 0) {
                    const product = lastAction.product;
                    // Actualizar carrito local del chatbot
                    setCurrentOrder(prev => ({
                        ...prev,
                        products: [...prev.products, { ...product, quantity }]
                    }));
                    // También agregar al contexto del carrito general si se desea sincronizar
                    for (let i = 0; i < quantity; i++) addToCart(product);

                    setOrderState('ASKING_BEVERAGES');
                    botText = `¡Listo! He añadido ${quantity} ${product.name}. ¿Te gustaría agregar alguna bebida? (Refresco, Agua de Sabor o presiona 'no' para continuar)`;
                } else {
                    botText = "Por favor, dime una cantidad válida (ejemplo: 2 o 3).";
                }
                break;

            case 'ASKING_BEVERAGES':
                if (text.includes('si') || text.includes('bebida') || text.includes('refresco') || text.includes('agua')) {
                    const beverage = products.find(p => p.category === 'Bebidas' && (text.includes(p.name.toLowerCase().split(' ')[0]) || text.includes('refresco') || text.includes('agua')));
                    if (beverage) {
                        setCurrentOrder(prev => ({
                            ...prev,
                            products: [...prev.products, { ...beverage, quantity: 1 }]
                        }));
                        addToCart(beverage);
                        setOrderState('ASKING_LOCATION');
                        botText = `¡Perfecto! Un(a) ${beverage.name} añadida. Ahora, para el envío, ¿cuál es tu dirección completa de entrega? 📍`;
                    } else {
                        botText = "Contamos con Refresco 600ml, Agua de Sabor o Refresco Familiar 2L. ¿Cuál prefieres?";
                    }
                } else {
                    setOrderState('ASKING_LOCATION');
                    botText = "Entendido, sin bebidas por ahora. ¿A qué dirección enviamos tu pedido? 📍";
                }
                break;

            case 'ASKING_LOCATION':
                if (text.length > 5) {
                    setCurrentOrder(prev => ({ ...prev, location: inputText }));
                    setOrderState('ASKING_PAYMENT');
                    botText = "¡Gracias! Ya casi terminamos. ¿Cómo prefieres pagar? (Efectivo, Tarjeta o Mercado Pago)";
                } else {
                    botText = "Por favor, proporciona una dirección de entrega válida para poder enviarte el pedido.";
                }
                break;

            case 'ASKING_PAYMENT':
                if (text.includes('efectivo') || text.includes('tarjeta') || text.includes('mercado')) {
                    const payment = text.includes('efectivo') ? 'Efectivo' : (text.includes('tarjeta') ? 'Tarjeta' : 'Mercado Pago');
                    setCurrentOrder(prev => ({ ...prev, paymentMethod: payment }));
                    setOrderState('CONFIRMING');
                    botText = `¡Excelente! Tu pedido será pagado con ${payment}. ¿Confirmas que todos los datos son correctos para enviar a cocina? (Responde 'confirmar')`;
                } else {
                    botText = "¿Preferirías pagar en Efectivo, con Tarjeta al recibir, o por Mercado Pago?";
                }
                break;

            case 'CONFIRMING':
                if (text.includes('si') || text.includes('confirmar') || text.includes('ok')) {
                    botText = "¡Fuego en la cocina! 🔥 Tu pedido ha sido enviado. En un momento te contactarán vía WhatsApp para el seguimiento.";
                    setTimeout(() => {
                        handleWhatsAppClick();
                        setOrderState('IDLE');
                        setCurrentOrder({ products: [], location: '', paymentMethod: '' });
                    }, 2000);
                } else {
                    botText = "Si necesitas cambiar algo, solo dímelo. Si no, escribe 'confirmar'.";
                }
                break;

            default:
                setOrderState('IDLE');
                botText = "Hubo un pequeño error en mi lógica, pero ya estoy listo de nuevo. ¿Qué te gustaría pedir?";
        }

        addBotMessage(botText);
    };

    const handleWhatsAppClick = () => {
        const phone = "521234567890";
        const total = currentOrder.products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
        const itemsList = currentOrder.products.map(p => `- ${p.quantity}x ${p.name}`).join('\n');

        const message = `¡Hola Patrón! Vengo del Chatbot 🤠. Aquí está mi pedido:\n\n` +
            `*Detalle del Pedido:*\n${itemsList}\n\n` +
            `*Total:* $${total.toFixed(2)}\n\n` +
            `*Dirección de Entrega:* ${currentOrder.location}\n` +
            `*Método de Pago:* ${currentOrder.paymentMethod}\n\n` +
            `¡Espero mis carnitas con ansias! 🌮✨`;

        const encodedLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(encodedLink, '_blank');
    };

    return (
        <div style={styles.chatWrapper}>
            {/* Botón Flotante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    ...styles.launcher,
                    animation: !isOpen ? 'pulse-soft 2s infinite' : 'none'
                }}
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Ventana de Chat */}
            {isOpen && (
                <div style={styles.window} className="animate-pop">
                    <div style={styles.header}>
                        <div style={styles.botInfo}>
                            <span style={styles.botAvatar}>🤠</span>
                            <div>
                                <h4 style={styles.botName}>Patrón-Bot</h4>
                                <small style={styles.botStatus}>En línea</small>
                            </div>
                        </div>
                    </div>

                    <div style={styles.messages} ref={scrollRef}>
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                style={{
                                    ...styles.messageRow,
                                    justifyContent: msg.sender === 'bot' ? 'flex-start' : 'flex-end'
                                }}
                            >
                                <div style={{
                                    ...styles.messageBubble,
                                    backgroundColor: msg.sender === 'bot' ? '#f0f0f0' : 'var(--primary)',
                                    color: msg.sender === 'bot' ? '#333' : 'white',
                                    borderRadius: msg.sender === 'bot' ? '0 15px 15px 15px' : '15px 15px 0 15px'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={styles.inputArea}>
                        <input
                            type="text"
                            placeholder="Escribe un mensaje..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            style={styles.input}
                        />
                        <button onClick={handleSend} style={styles.sendBtn}>➤</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    chatWrapper: {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        fontFamily: 'Outfit, sans-serif',
    },
    launcher: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary)',
        color: 'white',
        fontSize: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
        border: 'none',
        cursor: 'pointer',
    },
    window: {
        position: 'absolute',
        bottom: '80px',
        right: '0',
        width: '320px',
        height: '450px',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    header: {
        padding: '1.2rem',
        backgroundColor: 'var(--primary)',
        color: 'white',
    },
    botInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
    },
    botAvatar: {
        fontSize: '1.8rem',
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: '45px',
        height: '45px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
    },
    botName: {
        margin: 0,
        fontSize: '1rem',
    },
    botStatus: {
        opacity: 0.8,
        fontSize: '0.75rem',
    },
    messages: {
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        backgroundColor: '#f9f9f9',
    },
    messageRow: {
        display: 'flex',
        width: '100%',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: '0.8rem 1rem',
        fontSize: '0.9rem',
        lineHeight: '1.4',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    },
    inputArea: {
        padding: '1rem',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '0.5rem',
    },
    input: {
        flex: 1,
        border: '1px solid #ddd',
        borderRadius: '20px',
        padding: '0.5rem 1rem',
        fontSize: '0.9rem',
        outline: 'none',
    },
    sendBtn: {
        backgroundColor: 'var(--primary)',
        color: 'white',
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
    }
};

export default Chatbot;
