import React, { useEffect, useRef, useId } from 'react';

const MercadoPagoBtn = ({ amount, onPaymentReady }) => {

    const rawId = useId();
    const containerId = `paymentBrick_container_${rawId.replace(/:/g, '')}`;
    const controllerRef = useRef(null);
    const mpRef = useRef(null);

    useEffect(() => {
        if (!window.MercadoPago) return;
        let isMounted = true;

        const mpKey = import.meta.env.VITE_MP_PUBLIC_KEY || 'APP_USR-39ce3633-4cdc-40c3-a549-b642b90740bd';
        const mp = new window.MercadoPago(mpKey, {
            locale: 'es-MX'
        });

        mpRef.current = mp;

        const bricksBuilder = mp.bricks();

        const renderPaymentBrick = async (bricksBuilder) => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `<div id="${containerId}_loading_msg"></div>`;
                const loadingMsg = document.getElementById(`${containerId}_loading_msg`);
                if (loadingMsg) {
                    loadingMsg.innerHTML = '<p style="text-align:center;padding-top:2rem;color:#e8d09f;font-family:var(--font-serif);">Iniciando pasarela de pago segura...</p>';
                }
            }

            try {
                const settings = {
                    initialization: {
                        amount: amount,
                        payer: {
                            email: "test_user_123@testuser.com", // Placeholder
                        },
                    },
                    customization: {
                        paymentMethods: {
                            creditCard: "all",
                            debitCard: "all",
                        },
                        visual: {
                            style: {
                                theme: 'dark',
                            }
                        }
                    },
                    callbacks: {
                        onReady: () => {
                            const loadingElement = document.getElementById(`${containerId}_loading_msg`);
                            if (loadingElement) loadingElement.style.display = 'none';
                        },
                        onSubmit: ({ selectedPaymentMethod, formData }) => {
                            // Enviar los datos al backend para procesar el pago
                            const apiUrl = import.meta.env.VITE_API_URL || '';
                            return new Promise((resolve, reject) => {
                                fetch(`${apiUrl}/process_payment`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ formData }),
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.status === 'approved') {
                                            alert("✅ ¡Oink! Pago aprobado con éxito. ¡Gracias por tu compra!");
                                            if (onPaymentReady) onPaymentReady(data);
                                            resolve();
                                        } else {
                                            alert("⚠️ Estado del pago: " + (data.status_detail || data.status));
                                            resolve();
                                        }
                                    })
                                    .catch(error => {
                                        console.error("Communication Error:", error);
                                        alert("❌ Error de comunicación con el servidor de pagos.");
                                        reject();
                                    });
                            });
                        },
                        onError: (error) => {
                            console.error("MP Brick Error:", error);
                        },
                    },
                };

                const controller = await bricksBuilder.create(
                    'payment',
                    containerId,
                    settings
                );

                if (!isMounted) {
                    controller.unmount();
                    return;
                }
                controllerRef.current = controller;
            } catch (e) {
                console.error("Failed to render MP Brick", e);
            }
        };

        renderPaymentBrick(bricksBuilder);

        return () => {
            isMounted = false;
            if (controllerRef.current) {
                // El método unmount() es la forma correcta de limpiar el Brick
                if (typeof controllerRef.current.unmount === 'function') {
                    controllerRef.current.unmount();
                }
                controllerRef.current = null;
            }
        };
    }, [amount]);

    return (
        <div style={styles.container}>
            <div id={containerId}>
                <div id={`${containerId}_loading_msg`} style={styles.loadingMsg}>
                    <p>Cargando módulo de pago seguro...</p>
                    <small style={styles.note}>Nota: Requiere una Public Key válida de Mercado Pago para renderizar el formulario completo.</small>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        marginTop: '1rem',
        padding: '1.5rem',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '1.2rem',
        minHeight: '400px',
        border: '1px solid rgba(232, 208, 159, 0.1)',
        boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
    },
    loadingMsg: {
        textAlign: 'center',
        paddingTop: '4rem',
        color: 'var(--accent)',
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        fontSize: '1rem',
    },
    note: {
        display: 'block',
        marginTop: '1.5rem',
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        opacity: 0.6,
        lineHeight: '1.4'
    }
}

export default MercadoPagoBtn;
