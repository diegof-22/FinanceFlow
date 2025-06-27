import { getAuth } from 'firebase/auth';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

class PushNotificationService {
  private vapidKey: string | null = null;

  async requestPermission(): Promise<boolean> {
    try { 
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Errore nella richiesta dei permessi:', error);
      return false;
    }
  }

  async fetchVapidPublicKey(idToken: string): Promise<string> {
    const response = await fetch('/api/webpush/vapid-public-key', {
      headers: { 'Authorization': `Bearer ${idToken}` }
    });
    const data = await response.json();
    return data.publicKey;
  }

  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    try {
      const existingRegistration = await navigator.serviceWorker.getRegistration('/sw.js');
      if (existingRegistration) {
        console.log('Service Worker già registrato:', existingRegistration);
        return existingRegistration;
      }
      console.log('Registrazione nuovo Service Worker...');
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      if (registration.installing) {
        await new Promise<void>((resolve) => {
          registration.installing?.addEventListener('statechange', (e) => {
            if ((e.target as ServiceWorker).state === 'activated') {
              resolve();
            }
          });
        });
      }
      return registration;
    } catch (error) {
      console.error('Errore nella registrazione del Service Worker:', error);
      return null;
    }
  }

  async subscribeToPushNotifications(registration: ServiceWorkerRegistration, vapidKey: string): Promise<PushSubscription | null> {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });
      return subscription;
    } catch (error) {
      console.error('Errore nella subscription push:', error);
      return null;
    }
  }

  async setupWebPushSubscription(): Promise<PushSubscription | null> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Utente non autenticato');
      }
      const idToken = await user.getIdToken();
      const permission = await this.requestPermission();
      if (!permission) {
        console.log('Permesso notifiche negato');
        return null;
      }
      const registration = await this.registerServiceWorker();
      if (!registration) {
        console.log('Service Worker non registrato');
        return null;
      }
      const vapidKey = await this.fetchVapidPublicKey(idToken);
      this.vapidKey = vapidKey;
      const subscription = await this.subscribeToPushNotifications(registration, vapidKey);
      if (!subscription) return null;
     
      await fetch('/api/webpush/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ subscription }),
      });
      console.log('Subscription push salvata con successo');
      return subscription;
    } catch (error) {
      console.error('Errore nella configurazione della subscription web push:', error);
      return null;
    }
  }
}

export const pushNotificationService = new PushNotificationService(); 