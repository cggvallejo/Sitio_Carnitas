import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('adminToken', data.token);
                navigate('/admin/dashboard');
            } else {
                setError(data.error || 'Error de autenticación');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-premium"
                style={styles.card}
            >
                <div style={styles.logoArea}>
                    <ChefHat size={48} color="var(--primary)" />
                    <h1 className="metallic-text" style={styles.title}>Panel Admin</h1>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <User size={20} style={styles.icon} />
                        <input 
                            type="text" 
                            placeholder="Usuario" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <Lock size={20} style={styles.icon} />
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? 'Entrando...' : 'ACCEDER'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
    },
    card: {
        padding: '50px',
        width: '100%',
        maxWidth: '400px',
        borderRadius: '30px',
        border: '1px solid rgba(232, 208, 159, 0.1)',
        textAlign: 'center',
    },
    logoArea: {
        marginBottom: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px'
    },
    title: {
        fontSize: '2rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    icon: {
        position: 'absolute',
        left: '15px',
        color: 'var(--primary)',
        opacity: 0.7
    },
    input: {
        width: '100%',
        padding: '15px 15px 15px 45px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(232, 208, 159, 0.2)',
        borderRadius: '12px',
        color: 'white',
        fontSize: '1rem',
        outline: 'none',
    },
    button: {
        padding: '15px',
        background: 'var(--accent)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: 'bold',
        letterSpacing: '0.1em',
        cursor: 'pointer',
        marginTop: '10px'
    },
    error: {
        color: '#ff4d4d',
        fontSize: '0.85rem',
        margin: '0'
    }
};

export default Login;
