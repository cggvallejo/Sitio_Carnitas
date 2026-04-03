import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, MapPin, Phone, Clock, ExternalLink, RefreshCw } from 'lucide-react';

const LocationManager = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/locations');
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

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const res = await fetch('http://localhost:3000/api/admin/locations', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(locations)
            });
            if (res.ok) {
                setMessage('📍 Sucursales actualizadas con éxito!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('❌ Error al guardar');
            }
        } catch (err) {
            setMessage('❌ Error de conexión');
        } finally {
            setSaving(false);
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
