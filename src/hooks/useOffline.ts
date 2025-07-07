import { useState, useEffect } from 'react';

export interface OfflineState {
  isOnline: boolean;
  isOffline: boolean;
  wasOffline: boolean;
}

export const useOffline = (): OfflineState => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Connessione ripristinata');
      setIsOnline(true);
      
      
      if (wasOffline) {
        console.log(' Riconnesso! Sincronizzazione in corso...');

      }
    };

    const handleOffline = () => {
      console.log('📱 Modalità offline attivata');
      setIsOnline(false);
      setWasOffline(true);
    };

    // Aggiungi event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline
  };
};

// Hook per verificare se una risorsa è disponibile offline
export const useOfflineResource = (url: string) => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if ('caches' in window) {
      caches.match(url)
        .then(response => {
          setIsAvailable(!!response);
        })
        .catch(() => {
          setIsAvailable(false);
        });
    } else {
      setIsAvailable(false);
    }
  }, [url]);

  return isAvailable;
};

// Utility per pre-cachare risorse importanti
export const precacheResource = async (url: string): Promise<boolean> => {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cache = await caches.open('financelow-runtime-v6-ultra-safe');
    const response = await fetch(url);
    
    if (response.ok) {
      await cache.put(url, response);
      console.log(`Risorsa pre-cachata: ${url}`);
      return true;
    }
    return false;
  } catch (error) {
    console.warn(`Impossibile pre-cachare ${url}:`, error);
    return false;
  }
};