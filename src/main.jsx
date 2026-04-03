import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Registro de inicio para depuración
console.log('%c[Patrona] Iniciando Aplicación...', 'color: #ff3366; font-weight: bold;');

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    console.log('%c[Patrona] Renderizado completado con éxito.', 'color: #d4b475; font-weight: bold;');
  } catch (error) {
    console.error('[Patrona] Error fatal durante el renderizado:', error);
  }
} else {
  console.error('[Patrona] Error: El elemento #root no fue encontrado en el DOM.');
}
