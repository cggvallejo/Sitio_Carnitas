import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, MapPin, Phone, Clock, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import ProcessModal from './ProcessModal';

const LocationManager = () => {
    const [locations, setLocations] = useState([]);
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

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || '';
                const res = await fetch(`${apiUrl}/api/locations`);
                const data = await res.json();
                setLocations(data);
            } catch (err) {
                console.error("Error fetching locations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, []);

    const addLog = (message, type = 'default') => {
        setModal(prev => ({
            ...prev,
            logs: [...prev.logs, { message, type }]
        }));
    };

    const handleSave = async () => {
        setModal({
            isOpen: true,
            progress: 10,
            title: 'Actualizando Sucursales',
            status: 'loading',
            logs: [{ message: 'Validando datos de ubicación...', type: 'info' }]
        });

        try {
            setModal(prev => ({ ...prev, progress: 30 }));
            addLog('Enviando cambios al servidor central...');

            const apiUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${apiUrl}/api/admin/locations`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(locations)
            });

            const result = await res.json();

            if (res.ok) {
                setModal(prev => ({ ...prev, progress: 70 }));
                addLog('✓ Información guardada localmente.', 'success');
                addLog('Sincronizando puntos de venta con GitHub...', 'info');

                if (result.git && result.git.success) {
                    setModal(prev => ({ ...prev, progress: 100, status: 'success' }));
                    addLog('✓ Repositorio actualizado con éxito.', 'success');
                } else {
                    setModal(prev => ({ ...prev, progress: 90, status: 'error' }));
                    addLog('⚠ Falló la sincronización con GitHub.', 'error');
                    if (result.git && result.git.stderr) addLog(`Error: ${result.git.stderr}`, 'error');
                }
            } else {
                setModal(prev => ({ ...prev, status: 'error' }));
                addLog('❌ Error al procesar solicitud en el servidor.', 'error');
            }
        } catch (err) {
            setModal(prev => ({ ...prev, status: 'error' }));
            addLog(`❌ Error de red: ${err.message}`, 'error');
        }
    };

    const handleChange = (id, field, value) => {
        setLocations(prev => prev.map(loc => loc.id === id ? { ...loc, [field]: value } : loc));
    };

    if (loading) return <p>Cargando sucursales...</p>;

    return (
        <div style={styles.container}>
            <div style={styles.actionBar}>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave} 
                    style={styles.saveBtn}
                    disabled={saving}
                >
                    <Save size={18} /> {saving ? 'ACTUALIZANDO...' : 'GUARDAR TODAS LAS SUCURSALES'}
                </motion.button>
            </div>

            {message && <p style={styles.statusMsg}>{message}</p>}

            <div style={styles.list}>
                {locations.map((loc) => (
                    <motion.div key={loc.id} style={styles.card} className="glass-premium">
                        <div style={styles.cardHeader}>
                            <MapPin size={24} color="var(--primary)" />
                            <input 
                                style={styles.inputTitle} 
                                value={loc.name} 
                                onChange={(e) => handleChange(loc.id, 'name', e.target.value)}
                            />
                        </div>

                        <div style={styles.formGrid}>
                            <div style={styles.inputWrapper}>
                                <label style={styles.label}>DIRECCIÓN COMPLETA</label>
                                <textarea 
                                    style={styles.textarea} 
                                    value={loc.address} 
                                    onChange={(e) => handleChange(loc.id, 'address', e.target.value)}
                                />
                            </div>

                            <div style={styles.inputWrapper}>
                                <label style={styles.label}>TELÉFONO DE CONTACTO</label>
                                <div style={styles.row}>
                                    <Phone size={16} />
                                    <input 
                                        style={styles.input} 
                                        value={loc.phone} 
                                        onChange={(e) => handleChange(loc.id, 'phone', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div style={styles.inputWrapper}>
                                <label style={styles.label}>HORARIOS DE ATENCIÓN</label>
                                <div style={styles.row}>
                                    <Clock size={16} />
                                    <input 
                                        style={styles.input} 
                                        value={loc.hours} 
                                        onChange={(e) => handleChange(loc.id, 'hours', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div style={styles.geoGrid}>
                                <div style={styles.inputWrapper}>
                                    <label style={styles.label}>LATITUD</label>
                                    <input 
                                        type="number"
                                        style={styles.input} 
                                        value={loc.lat} 
                                        onChange={(e) => handleChange(loc.id, 'lat', parseFloat(e.target.value))}
                                    />
                                </div>
                                <div style={styles.inputWrapper}>
                                    <label style={styles.label}>LONGITUD</label>
                                    <input 
                                        type="number"
                                        style={styles.input} 
                                        value={loc.lng} 
                                        onChange={(e) => handleChange(loc.id, 'lng', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div style={styles.inputWrapper}>
                                <label style={styles.label}>URL DE GOOGLE MAPS (DIRECCIÓN)</label>
                                <div style={styles.row}>
                                    <ExternalLink size={16} />
                                    <input 
                                        style={styles.input} 
                                        value={loc.mapUrl} 
                                        onChange={(e) => handleChange(loc.id, 'mapUrl', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div style={styles.inputWrapper}>
                                <label style={styles.label}>IFRAME URL (MAPA EMBEBIDO)</label>
                                <div style={styles.row}>
                                    <RefreshCw size={16} />
                                    <input 
                                        style={styles.input} 
                                        value={loc.iframeUrl} 
                                        onChange={(e) => handleChange(loc.id, 'iframeUrl', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

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
    container: { display: 'flex', flexDirection: 'column', gap: '20px' },
    actionBar: { display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' },
    saveBtn: { 
        padding: '12px 25px', background: 'var(--primary)', border: 'none', 
        color: 'var(--bg-main)', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '900', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '8px'
    },
    statusMsg: { color: 'var(--primary)', fontWeight: '600', textAlign: 'center', padding: '10px' },
    list: { display: 'flex', flexDirection: 'column', gap: '30px' },
    card: { 
        borderRadius: '25px', padding: '30px', 
        border: '1px solid rgba(232, 208, 159, 0.1)', background: 'rgba(255,255,255,0.02)'
    },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' },
    inputTitle: { background: 'transparent', border: 'none', color: 'white', fontSize: '1.8rem', fontWeight: 'bold', width: '100%', outline: 'none' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' },
    geoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    inputWrapper: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '0.65rem', color: 'var(--primary)', letterSpacing: '0.2em', fontWeight: 'bold' },
    input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '12px', fontSize: '0.9rem', outline: 'none', width: '100%' },
    textarea: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '12px', fontSize: '0.9rem', outline: 'none', height: '80px', resize: 'none' },
    row: { display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.8 }
};

export default LocationManager;
