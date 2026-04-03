import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, ShieldCheck, Key, User, Lock, AlertTriangle } from 'lucide-react';

const ConfigManager = () => {
    const [config, setConfig] = useState({
        mp_public_key: '',
        mp_access_token: '',
        admin_user: '',
    });
    const [passwords, setPasswords] = useState({
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/admin/config', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setConfig(data);
            } catch (err) {
                console.error("Error fetching config:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, [token]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (passwords.new_password && passwords.new_password !== passwords.confirm_password) {
            alert('Las contraseñas no coinciden');
            return;
        }

        setSaving(true);
        setMessage('');
        try {
            const body = { ...config };
            if (passwords.new_password) body.new_password = passwords.new_password;

            const res = await fetch('http://localhost:3000/api/admin/config', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                setMessage('🛡️ ¡Configuración actualizada correctamente!');
                setPasswords({ new_password: '', confirm_password: '' });
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('❌ Error al actualizar');
            }
        } catch (err) {
            setMessage('❌ Error de conexión');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Cargando configuración...</p>;

    return (
        <div style={styles.container}>
            <form onSubmit={handleSave} style={styles.form}>
                <section style={styles.section} className="glass-premium">
                    <div style={styles.sectionHeader}>
                        <ShieldCheck size={24} color="var(--primary)" />
                        <h2 style={styles.sectionTitle}>PASARELA DE PAGOS (MERCADO PAGO)</h2>
                    </div>
                    
                    <div style={styles.warningBox}>
                        <AlertTriangle size={18} />
                        <span>Ten cuidado: cambiar estos valores afectará directamente la recepción de dinero.</span>
                    </div>

                    <div style={styles.fieldGrid}>
                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>PUBLIC KEY (PRODUCCIÓN)</label>
                            <div style={styles.row}>
                                <Key size={16} />
                                <input 
                                    style={styles.input} 
                                    value={config.mp_public_key} 
                                    onChange={(e) => setConfig({ ...config, mp_public_key: e.target.value })}
                                    placeholder="APP_USR-..."
                                />
                            </div>
                        </div>

                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>ACCESS TOKEN (PRODUCCIÓN)</label>
                            <div style={styles.row}>
                                <Lock size={16} />
                                <input 
                                    type="password"
                                    style={styles.input} 
                                    value={config.mp_access_token} 
                                    onChange={(e) => setConfig({ ...config, mp_access_token: e.target.value })}
                                    placeholder="APP_USR-..."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section style={styles.section} className="glass-premium">
                    <div style={styles.sectionHeader}>
                        <User size={24} color="var(--primary)" />
                        <h2 style={styles.sectionTitle}>CREDENCIALES DE ACCESO</h2>
                    </div>

                    <div style={styles.fieldGrid}>
                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>NOMBRE DE USUARIO</label>
                            <input 
                                style={styles.input} 
                                value={config.admin_user} 
                                onChange={(e) => setConfig({ ...config, admin_user: e.target.value })}
                            />
                        </div>

                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>NUEVA CONTRASEÑA (OPCIONAL)</label>
                            <input 
                                type="password"
                                style={styles.input} 
                                value={passwords.new_password} 
                                onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                                placeholder="Dejar vacío para no cambiar"
                            />
                        </div>

                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>CONFIRMAR NUEVA CONTRASEÑA</label>
                            <input 
                                type="password"
                                style={styles.input} 
                                value={passwords.confirm_password} 
                                onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                            />
                        </div>
                    </div>
                </section>

                <div style={styles.footer}>
                    {message && <p style={styles.statusMsg}>{message}</p>}
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        style={styles.saveBtn}
                        disabled={saving}
                    >
                        <Save size={18} /> {saving ? 'GUARDANDO...' : 'APLICAR CAMBIOS DE SEGURIDAD'}
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: { maxWidth: '900px', margin: '0 auto' },
    form: { display: 'flex', flexDirection: 'column', gap: '30px' },
    section: { padding: '30px', borderRadius: '30px', border: '1px solid rgba(232,208,159,0.1)' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
    sectionTitle: { fontSize: '0.9rem', letterSpacing: '0.2em', fontWeight: '900', color: 'white' },
    warningBox: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(255,193,7,0.1)', color: '#ffc107', borderRadius: '10px', fontSize: '0.8rem', marginBottom: '20px' },
    fieldGrid: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputWrapper: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold' },
    input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px', padding: '15px', width: '100%', outline: 'none' },
    row: { display: 'flex', alignItems: 'center', gap: '15px' },
    footer: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' },
    saveBtn: { 
        padding: '15px 40px', background: 'var(--accent)', color: 'white', border: 'none', 
        borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' 
    },
    statusMsg: { color: 'var(--primary)', fontWeight: '600' }
};

export default ConfigManager;
