import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ProductManager from '../../components/Admin/ProductManager';
import LocationManager from '../../components/Admin/LocationManager';
import ConfigManager from '../../components/Admin/ConfigManager';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        if (!token) navigate('/admin/login');
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const tabs = [
        { id: 'products', label: 'Menú', icon: <ShoppingBag size={20}/> },
        { id: 'locations', label: 'Sucursales', icon: <MapPin size={20}/> },
        { id: 'config', label: 'Ajustes de Pago', icon: <Settings size={20}/> },
    ];

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={styles.sidebar} className="glass-premium">
                <div style={styles.sidebarHeader}>
                    <h2 className="metallic-text" style={styles.brand}>ADMINISTRACIÓN</h2>
                </div>

                <nav style={styles.nav}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                ...styles.tabBtn,
                                color: activeTab === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.6)',
                                background: activeTab === tab.id ? 'rgba(232,208,159,0.1)' : 'transparent',
                                borderRight: activeTab === tab.id ? '3px solid var(--primary)' : 'none',
                            }}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                            {activeTab === tab.id && <ChevronRight size={16} />}
                        </button>
                    ))}
                </nav>

                <div style={styles.sidebarFooter}>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        <LogOut size={18} />
                        <span>CERRAR SESIÓN</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={styles.main}>
                <header style={styles.header}>
                    <h1 style={styles.headerTitle}>
                        Gestión de {tabs.find(t => t.id === activeTab).label}
                    </h1>
                </header>

                <div style={styles.content}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'products' && <ProductManager />}
                            {activeTab === 'locations' && <LocationManager />}
                            {activeTab === 'config' && <ConfigManager />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: {
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        minHeight: '100vh',
        background: '#0a0a0a',
        color: 'white',
    },
    sidebar: {
        background: 'rgba(15,15,15,0.8)',
        borderRight: '1px solid rgba(232,208,159,0.15)',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 0',
    },
    sidebarHeader: {
        padding: '0 30px',
        marginBottom: '50px',
    },
    brand: {
        fontSize: '1.4rem',
        letterSpacing: '0.15em',
        fontWeight: '900',
    },
    nav: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    tabBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '18px 30px',
        border: 'none',
        textAlign: 'left',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
    },
    sidebarFooter: {
        padding: '0 30px',
        marginTop: 'auto',
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '15px 0',
        background: 'transparent',
        border: 'none',
        color: '#ff4d4d',
        fontWeight: 'bold',
        fontSize: '0.85rem',
        cursor: 'pointer',
        letterSpacing: '0.1em',
    },
    main: {
        padding: '40px',
        overflowY: 'auto',
        maxHeight: '100vh',
    },
    header: {
        marginBottom: '40px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        paddingBottom: '20px',
    },
    headerTitle: {
        fontSize: '2.4rem',
        fontWeight: '300',
        color: 'var(--accent)',
    },
    content: {
        minHeight: '400px',
    }
};

export default Dashboard;
