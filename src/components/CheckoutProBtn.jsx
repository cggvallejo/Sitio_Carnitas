import { useState } from 'react';

const CheckoutProBtn = ({ cart, total }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheckoutPro = async () => {
        setLoading(true);
        setError(null);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const res = await fetch(`${apiUrl}/create_preference`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart, total }),
            });
            const data = await res.json();
            if (data.init_point) {
                window.location.href = data.init_point;
            } else {
                setError('No se pudo generar el link de pago. Intenta de nuevo.');
            }
        } catch (e) {
            setError('Error de conexión con el servidor de pagos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            {/* Logo de Mercado Pago */}
            <div style={styles.logoArea}>
                <svg viewBox="0 0 32 32" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#00B1EA"/>
                    <text x="16" y="21" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white" fontFamily="Arial">MP</text>
                </svg>
                <span style={styles.logoText}>Mercado Pago</span>
            </div>

            <p style={styles.description}>
                Paga con tarjeta, transferencia o efectivo.<br/>
                Tu transacción es 100% segura.
            </p>

            {/* Métodos aceptados */}
            <div style={styles.badges}>
                <span style={styles.badge}>VISA</span>
                <span style={styles.badge}>Mastercard</span>
                <span style={styles.badge}>AMEX</span>
                <span style={styles.badge}>OXXO</span>
                <span style={styles.badge}>SPEI</span>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button
                onClick={handleCheckoutPro}
                disabled={loading}
                style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            >
                {loading ? '⏳ Conectando...' : '🔒 Pagar con Mercado Pago'}
            </button>

            <p style={styles.note}>Serás redirigido al portal seguro de pago.</p>
        </div>
    );
};

const styles = {
    wrapper: {
        padding: '1.5rem 1rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
    },
    logoArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    logoText: {
        fontSize: '1.3rem',
        fontWeight: '700',
        color: '#00B1EA',
        letterSpacing: '0.03em',
    },
    description: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        lineHeight: '1.6',
        margin: 0,
    },
    badges: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.4rem',
    },
    badge: {
        padding: '0.25rem 0.6rem',
        borderRadius: '0.4rem',
        fontSize: '0.7rem',
        fontWeight: '600',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: 'var(--text-main)',
        letterSpacing: '0.04em',
    },
    btn: {
        width: '100%',
        padding: '1rem',
        borderRadius: '0.8rem',
        border: 'none',
        background: 'linear-gradient(135deg, #00B1EA 0%, #009EDB 100%)',
        color: '#fff',
        fontWeight: '700',
        fontSize: '1rem',
        cursor: 'pointer',
        letterSpacing: '0.05em',
        boxShadow: '0 8px 20px rgba(0, 177, 234, 0.35)',
        transition: 'all 0.3s ease',
    },
    error: {
        color: '#ff6b6b',
        fontSize: '0.8rem',
        background: 'rgba(255,107,107,0.1)',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        width: '100%',
    },
    note: {
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        opacity: 0.7,
        margin: 0,
    },
};

export default CheckoutProBtn;
