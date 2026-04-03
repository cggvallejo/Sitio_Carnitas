import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, ShoppingBag, Edit3, Image as ImageIcon, Loader2 } from 'lucide-react';
import ProcessModal from './ProcessModal';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
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
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
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
            title: 'Guardando Cambios en el Menú',
            status: 'loading',
            logs: [{ message: 'Preparando datos de productos...', type: 'info' }]
        });

        try {
            setModal(prev => ({ ...prev, progress: 30 }));
            addLog('Enviando menú actualizado al servidor...');

            const res = await fetch('http://localhost:3000/api/admin/products', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(products)
            });

            const result = await res.json();

            if (res.ok) {
                setModal(prev => ({ ...prev, progress: 60 }));
                addLog('✓ Base de datos local actualizada correctamente.', 'success');
                addLog('Iniciando sincronización con GitHub...', 'info');

                if (result.git && result.git.success) {
                    setModal(prev => ({ ...prev, progress: 100, status: 'success' }));
                    addLog('✓ Sincronización Git completada exitosamente.', 'success');
                } else {
                    setModal(prev => ({ ...prev, progress: 90, status: 'error' }));
                    addLog('⚠ Error en la sincronización Git.', 'error');
                    if (result.git && result.git.stderr) addLog(`Error: ${result.git.stderr}`, 'error');
                }
            } else {
                setModal(prev => ({ ...prev, status: 'error' }));
                addLog('❌ Error al guardar datos en el servidor.', 'error');
            }
        } catch (err) {
            setModal(prev => ({ ...prev, status: 'error' }));
            addLog(`❌ Error de conexión: ${err.message}`, 'error');
        }
    };

    const handleChange = (id, field, value) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleAdd = () => {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 100;
        const newProduct = {
            id: newId,
            name: 'Nuevo Producto',
            price: 0,
            description: '',
            category: 'Tacos',
            image: '/food-truck.jpg'
        };
        setProducts([...products, newProduct]);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Eliminar este producto permanentemente?')) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleFileUpload = async (id, file) => {
        if (!file) return;

        setModal({
            isOpen: true,
            progress: 10,
            title: 'Subiendo Imagen',
            status: 'loading',
            logs: [{ message: `Preparando archivo: ${file.name}`, type: 'info' }]
        });

        const formData = new FormData();
        formData.append('image', file);

        try {
            setModal(prev => ({ ...prev, progress: 40 }));
            addLog('Subiendo archivo al servidor comercial...');

            const res = await fetch('http://localhost:3000/api/admin/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            
            if (res.ok && data.url) {
                handleChange(id, 'image', data.url);
                setModal(prev => ({ ...prev, progress: 70 }));
                addLog('✓ Archivo subido correctamente.', 'success');
                addLog('Sincronizando nueva imagen con el repositorio...', 'info');

                if (data.git && data.git.success) {
                    setModal(prev => ({ ...prev, progress: 100, status: 'success' }));
                    addLog('✓ Sincronización de imagen completada.', 'success');
                } else {
                    setModal(prev => ({ ...prev, progress: 95, status: 'error' }));
                    addLog('⚠ La imagen se subió pero el push a Git falló.', 'error');
                }
            } else {
                setModal(prev => ({ ...prev, status: 'error' }));
                addLog('❌ Error al procesar la subida en el servidor.', 'error');
            }
        } catch (err) {
            setModal(prev => ({ ...prev, status: 'error' }));
            addLog(`❌ Error de subida: ${err.message}`, 'error');
        }
    };

    if (loading) return <p>Cargando menú...</p>;

    return (
        <div style={styles.container}>
            <div style={styles.actionBar}>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdd} 
                    style={styles.addBtn}
                >
                    <Plus size={18} /> AGREGAR PRODUCTO
                </motion.button>

                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave} 
                    style={styles.saveBtn}
                    disabled={saving}
                >
                    <Save size={18} /> {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                </motion.button>
            </div>

            {message && <p style={styles.statusMsg}>{message}</p>}

            <div style={styles.grid}>
                {products.map((p) => (
                    <motion.div 
                        layout
                        key={p.id} 
                        style={styles.card} 
                        className="glass-premium"
                    >
                        <div style={styles.imagePreview}>
                            <img src={p.image} alt={p.name} style={styles.img} />
                            <div style={styles.imgOverlay}>
                                <ImageIcon size={20} />
                            </div>
                        </div>

                        <div style={styles.cardFields}>
                            <input 
                                style={styles.inputTitle} 
                                value={p.name} 
                                onChange={(e) => handleChange(p.id, 'name', e.target.value)}
                                placeholder="Nombre del producto"
                            />
                            
                            <div style={styles.row}>
                                <div style={styles.priceGroup}>
                                    <span style={styles.currency}>$</span>
                                    <input 
                                        type="number"
                                        style={styles.inputPrice} 
                                        value={p.price} 
                                        onChange={(e) => handleChange(p.id, 'price', parseFloat(e.target.value))}
                                    />
                                </div>
                                <select 
                                    style={styles.select} 
                                    value={p.category}
                                    onChange={(e) => handleChange(p.id, 'category', e.target.value)}
                                >
                                    <option>Tacos</option>
                                    <option>Tortas</option>
                                    <option>Gorditas</option>
                                    <option>Bebidas</option>
                                    <option>Complementos</option>
                                </select>
                            </div>

                            <textarea 
                                style={styles.textarea} 
                                value={p.description} 
                                onChange={(e) => handleChange(p.id, 'description', e.target.value)}
                                placeholder="Descripción corta..."
                            />

                            <div style={styles.imageInputRow}>
                                <ImageIcon size={16} />
                                <input 
                                    style={styles.imgInput} 
                                    value={p.image} 
                                    onChange={(e) => handleChange(p.id, 'image', e.target.value)}
                                    placeholder="URL de la imagen"
                                />
                                <label style={styles.uploadBtn}>
                                    <Plus size={14} /> SUBIR
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        style={{ display: 'none' }} 
                                        onChange={(e) => handleFileUpload(p.id, e.target.files[0])}
                                    />
                                </label>
                            </div>
                        </div>

                        <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>
                            <Trash2 size={16} />
                        </button>
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
    actionBar: { display: 'flex', gap: '15px', marginBottom: '20px' },
    addBtn: { 
        padding: '12px 20px', background: 'transparent', border: '1px solid var(--primary)', 
        color: 'var(--primary)', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '8px'
    },
    saveBtn: { 
        padding: '12px 25px', background: 'var(--accent)', border: 'none', 
        color: 'white', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '8px'
    },
    statusMsg: { color: 'var(--primary)', fontWeight: '600', textAlign: 'center', padding: '10px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
    card: { 
        borderRadius: '20px', padding: '15px', position: 'relative', 
        border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' 
    },
    imagePreview: { height: '140px', borderRadius: '15px', overflow: 'hidden', position: 'relative', background: '#111' },
    img: { width: '100%', height: '100%', objectFit: 'cover' },
    imgOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s' },
    cardFields: { display: 'flex', flexDirection: 'column', gap: '10px' },
    inputTitle: { background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', padding: '5px 0' },
    row: { display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center' },
    priceGroup: { display: 'flex', alignItems: 'center', background: 'rgba(232,208,159,0.05)', padding: '5px 10px', borderRadius: '8px' },
    currency: { color: 'var(--primary)', fontWeight: 'bold', marginRight: '5px' },
    inputPrice: { background: 'transparent', border: 'none', color: 'white', width: '60px', fontSize: '1.1rem', fontWeight: 'bold' },
    select: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', padding: '5px' },
    textarea: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', borderRadius: '8px', padding: '10px', fontSize: '0.85rem', resize: 'none', height: '60px' },
    imageInputRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    imgInput: { background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', flex: 1, outline: 'none' },
    uploadBtn: { 
        background: 'rgba(232,208,159,0.1)', color: 'var(--primary)', padding: '5px 10px', 
        borderRadius: '5px', fontSize: '0.65rem', fontWeight: 'bold', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '3px', border: '1px solid rgba(232,208,159,0.2)'
    },
    deleteBtn: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,77,77,0.1)', border: 'none', color: '#ff4d4d', padding: '8px', borderRadius: '50%', cursor: 'pointer' }
};

export default ProductManager;
