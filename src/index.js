import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' 
      });
      
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              console.log('Nuovo service worker installato');
              if (navigator.serviceWorker.controller) {
                
                if (window.confirm('È disponibile un aggiornamento dell\'app. Vuoi ricaricare?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              } else {
                
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            }
          });
        }
      });
      
  
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller cambiato - ricaricando...');
        window.location.reload();
      });
      
    } catch (registrationError) {
      console.log('Registrazione SW fallita:', registrationError);
    }
  });
  
  
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
      console.log('Cache aggiornata dal service worker');
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);