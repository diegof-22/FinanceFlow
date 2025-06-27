import { useEffect, useRef } from 'react';
import { useAuth } from '../lib/firebase';
import { pushNotificationService } from '../services/pushNotifications';

export default function PushSubscriptionManager() {
  const { user } = useAuth();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!user) {
      initializedRef.current = false;
      return;
    }
    if (initializedRef.current) return;
    initializedRef.current = true;

    setTimeout(async () => {
      try {
        if (Notification.permission === 'denied') {
          console.log('Permessi notifiche negati dall\'utente:', user.email);
          return;
        }
        const registration = await navigator.serviceWorker.getRegistration('/sw.js');
        if (registration) {
          const existingSubscription = await registration.pushManager.getSubscription();
          if (existingSubscription) {
            console.log('Subscription push già esistente per:', user.email);
            return;
          }
        }
        const subscription = await pushNotificationService.setupWebPushSubscription();
        if (subscription) {
          console.log('Push notifications inizializzate automaticamente per:', user.email);
        } else {
          console.log('Push notifications non inizializzate per:', user.email);
        }
      } catch (error) {
        console.error('Errore inizializzazione push notifications:', error);
      }
    }, 2000);
  }, [user]);

  return null;
} 