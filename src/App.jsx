import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import CartSidebar from './components/CartSidebar';
import { CartProvider } from './context/CartContext';

// Social & Interactive Components (Lazy)
const Chatbot = lazy(() => import('./components/Chatbot'));
const PorkbotPeeker = lazy(() => import('./components/PorkbotPeeker'));
const PorkbotCursorThief = lazy(() => import('./components/PorkbotCursorThief'));

// Admin Pages (Lazy)
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));

const PageLoader = () => (
  <div style={{ height: '2px', width: '100%', background: 'linear-gradient(to right, var(--primary), var(--accent))', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
    <div className="loader-shimmer" style={{ width: '100%', height: '100%', animation: 'shimmer 2s infinite' }}></div>
  </div>
);

function App() {
  return (
    <CartProvider>
      <div className="app">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Website */}
            <Route path="/" element={
              <>
                <Header />
                <Home />
                <CartSidebar />
                <Chatbot />
                <PorkbotPeeker />
                <PorkbotCursorThief />
              </>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Catch-all to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </div>
    </CartProvider>
  );
}

export default App;
