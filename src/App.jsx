import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import { CartProvider } from './context/CartContext';
import Chatbot from './components/Chatbot';
import PorkbotPeeker from './components/PorkbotPeeker';
import PorkbotCursorThief from './components/PorkbotCursorThief';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  return (
    <CartProvider>
      <div className="app">
        {/* Dynamic Animated Background */}
        <div className="dynamic-bg">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
        </div>

        <Header />

        <motion.main
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Hero />
          <ProductGrid />
        </motion.main>

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={styles.footer}
        >
          <div className="container" style={styles.footerContent}>
            <p>&copy; 2026 Carnitas "El Patrón" - Guadalajara, Jal.</p>
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              Hecho con <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}><Heart size={16} fill="var(--primary)" color="var(--primary)" /></motion.div> para los amantes del buen taco.
            </p>
          </div>
        </motion.footer>

        <CartSidebar />
        <PorkbotPeeker />
        <PorkbotCursorThief />
        <Chatbot />
      </div>
    </CartProvider>
  );
}

const styles = {
  footer: {
    padding: '4rem 0',
    backgroundColor: 'var(--text-main)',
    color: 'rgba(255,255,255,0.7)',
    marginTop: '4rem',
  },
  footerContent: {
    textAlign: 'center',
  }
};

export default App;
