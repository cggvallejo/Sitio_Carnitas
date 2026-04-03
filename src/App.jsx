import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import CartSidebar from './components/CartSidebar';
import { CartProvider } from './context/CartContext';
import Chatbot from './components/Chatbot';
import PorkbotPeeker from './components/PorkbotPeeker';
import PorkbotCursorThief from './components/PorkbotCursorThief';

// Admin Pages
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';

function App() {
  return (
    <CartProvider>
      <div className="app">
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
      </div>
    </CartProvider>
  );
}

export default App;
