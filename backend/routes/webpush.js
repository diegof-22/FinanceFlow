const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const webpush = require('web-push');
require('dotenv').config();

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  const vapidKeys = webpush.generateVAPIDKeys();
}

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

router.post('/subscription', async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { subscription } = req.body;
    if (!userEmail || !subscription) {
      return res.status(400).json({ error: 'userEmail e subscription sono richiesti' });
    }
    const userDoc = await db.collection('users').doc(userEmail).get();
    const userData = userDoc.data() || {};
    let pushSubscriptions = userData.pushSubscriptions || [];

    const exists = pushSubscriptions.some(s => s.endpoint === subscription.endpoint);
    if (!exists) {
      pushSubscriptions.push(subscription);
    }
    await db.collection('users').doc(userEmail).set({
      pushSubscriptions,
      subscriptionUpdatedAt: new Date().toISOString(),
    }, { merge: true });
    res.status(200).json({ message: 'Subscription salvata con successo' });
  } catch (error) {
    res.status(500).json({ error: 'Errore nel salvataggio della subscription', details: error.message });
  }
});

router.post('/send', async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { notification } = req.body;
    if (!userEmail || !notification) {
      return res.status(400).json({ error: 'userEmail e notification sono richiesti' });
    }
    const userDoc = await db.collection('users').doc(userEmail).get();
    const userData = userDoc.data();
    const subscriptions = userData?.pushSubscriptions || [];
    if (!subscriptions.length) {
      return res.status(404).json({ error: 'Nessuna subscription trovata per questo utente' });
    }
    let validCount = 0;
    let updatedSubscriptions = [];
    for (const subscription of subscriptions) {
      try {
        let notifPayload = notification;
        if (typeof notification === 'string') {
          notifPayload = { body: notification };
        }
        await webpush.sendNotification(subscription, JSON.stringify(notifPayload));
        validCount++;
        updatedSubscriptions.push(subscription);
      } catch (error) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          console.log('Subscription rimossa per utente:', userEmail);
        } else {
          updatedSubscriptions.push(subscription);
        }
        console.error('Errore invio notifica a', userEmail, error.body);
      }
    }
    await db.collection('users').doc(userEmail).update({ pushSubscriptions: updatedSubscriptions });
    res.status(200).json({ message: `Notifica inviata a ${validCount} dispositivi` });
  } catch (error) {
    console.error('Errore nell\'invio della notifica:', error);
    res.status(500).json({ error: 'Errore nell\'invio della notifica', details: error.body });
  }
});


router.post('/send-all', async (req, res) => {
  try {
    const { notification } = req.body;
    if (!notification) {
      return res.status(400).json({ error: 'notification è richiesto' });
    }
    const usersSnapshot = await db.collection('users').get();
    const promises = usersSnapshot.docs.map(async (doc) => {
      const userData = doc.data();
      const subscriptions = userData?.pushSubscriptions || [];
      if (!subscriptions.length) return { status: 'skipped', id: doc.id };
      let validCount = 0;
      let updatedSubscriptions = [];
      for (const subscription of subscriptions) {
        try {
          let notifPayload = notification;
          if (typeof notification === 'string') {
            notifPayload = { body: notification };
          }
          await webpush.sendNotification(subscription, JSON.stringify(notifPayload));
          validCount++;
          updatedSubscriptions.push(subscription);
        } catch (error) {
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log('Subscription rimossa per utente:', doc.id);
          } else {
            updatedSubscriptions.push(subscription);
          }
          console.error('Errore invio notifica a', doc.id, error.body);
        }
      }
      
      await doc.ref.update({ pushSubscriptions: updatedSubscriptions });
      if (validCount > 0) {
        return { status: 'success', id: doc.id };
      } else {
        return { status: 'fail', id: doc.id };
      }
    });

    const results = await Promise.allSettled(promises);
    const successUsers = results.filter(r => r.value?.status === 'success').map(r => r.value.id);
    const fail = results.filter(r => r.value?.status === 'fail').length;
    console.log('Notifica inviata ai seguenti utenti:', successUsers);
    const success = successUsers.length;

    res.status(200).json({ message: `Notifiche inviate. Successi: ${success}, Errori: ${fail}` });
  } catch (error) {
    res.status(500).json({ error: 'Errore invio notifiche a tutti', details: error.body });
  }
});

module.exports = router; 