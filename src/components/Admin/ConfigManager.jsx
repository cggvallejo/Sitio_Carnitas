import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, ShieldCheck, Key, User, Lock, AlertTriangle, CheckCircle, XCircle, RefreshCw, Loader2 } from 'lucide-react';
import ProcessModal from './ProcessModal';

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
    
    // Status Modal State
    const [modal, setModal] = useState({
        isOpen: false,
        progress: 0,
        logs: [],
        title: '',
        status: 'loading' // 'loading' | 'success' | 'error'
    });

    const [validatingMP, setValidatingMP] = useState(false);
    const [mpStatus, setMpStatus] = useState(null); // null | 'valid' | 'invalid'

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

    const addLog = (message, type = 'default') => {
        setModal(prev => ({
            ...prev,
            logs: [...prev.logs, { message, type }]
        }));
    };

    const handleValidateMP = async () => {
        if (!config.mp_access_token) return;
        setValidatingMP(true);
        setMpStatus(null);
        try {
            const res = await fetch('http://localhost:3000/api/admin/validate-mp', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ access_token: config.mp_access_token })
            });
            const data = await res.json();
            if (data.success) {
                setMpStatus('valid');
            } else {
                setMpStatus('invalid');
                alert(`Error de validación: ${data.details}`);
            }
        } catch (err) {
            setMpStatus('invalid');
        } finally {
            setValidatingMP(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (passwords.new_password && passwords.new_password !== passwords.confirm_password) {
            alert('Las contraseñas no coinciden');
            return;
        }

        setModal({
            isOpen: true,
            progress: 10,
            title: 'Actualizando Configuración',
            status: 'loading',
            logs: [{ message: 'Iniciando proceso de actualización...', type: 'info' }]
        });

        try {
            const body = { ...config };
            if (passwords.new_password) body.new_password = passwords.new_password;

            setModal(prev => ({ ...prev, progress: 30 }));
            addLog('Enviando datos al servidor principal...');

            const res = await fetch('http://localhost:3000/api/admin/config', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            
            const result = await res.json();

            if (res.ok) {
                setModal(prev => ({ ...prev, progress: 60 }));
                addLog('✓ Datos guardados en la base de datos local.', 'success');
                addLog('Iniciando sincronización con el repositorio de GitHub...', 'info');

                if (result.git && result.git.success) {
                    setModal(prev => ({ ...prev, progress: 100, status: 'success' }));
                    addLog('✓ Sincronización Git completada con éxito.', 'success');
                    if (result.git.stdout) addLog(`Output: ${result.git.stdout}`);
                } else {
                    setModal(prev => ({ ...prev, progress: 90, status: 'error' }));
                    addLog('⚠ Error en sincronización Git.', 'error');
                    if (result.git && result.git.stderr) addLog(`Error: ${result.git.stderr}`, 'error');
                }
                
                setPasswords({ new_password: '', confirm_password: '' });
            } else {
                setModal(prev => ({ ...prev, status: 'error' }));
                addLog('❌ Error crítico al guardar en el servidor.', 'error');
            }
        } catch (err) {
            setModal(prev => ({ ...prev, status: 'error' }));
            addLog(`❌ Error de red: ${err.message}`, 'error');
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
                                <div className="flex-1 flex gap-4">
                                    <input 
                                        type="password"
                                        style={styles.input} 
                                        value={config.mp_access_token} 
                                        onChange={(e) => setConfig({ ...config, mp_access_token: e.target.value })}
                                        placeholder="APP_USR-..."
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleValidateMP}
                                        disabled={validatingMP || !config.mp_access_token}
                                        className={`px-4 rounded-xl flex items-center gap-2 font-bold transition-all ${
                                            mpStatus === 'valid' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                                            mpStatus === 'invalid' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                                            'bg-white/5 text-white/60 hover:bg-white/10'
                                        }`}
                                    >
                                        {validatingMP ? <Loader2 className="animate-spin" size={16} /> : 
                                         mpStatus === 'valid' ? <CheckCircle size={16} /> :
                                         mpStatus === 'invalid' ? <XCircle size={16} /> : <RefreshCw size={16} />}
                                        {validatingMP ? '...' : 
                                         mpStatus === 'valid' ? 'VÁLIDO' :
                                         mpStatus === 'invalid' ? 'ERRÓNEO' : 'VERIFICAR'}
                                    </button>
                                </div>
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
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        style={styles.saveBtn}
                        disabled={saving}
                    >
                        <Save size={18} /> APLICAR CAMBIOS DE SEGURIDAD
                    </motion.button>
                </div>
            </form>

            <ProcessModal 
                isOpen={modal.isOpen}
                title={modal.title}
                progress={modal.progress}
                logs={modal.logs}
                status={modal.status}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
            />
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
