const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const { getCache, setCache, invalidateCache } = require('../services/cacheService');

router.get('/', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) return res.status(400).json({ error: 'User email is required' });

    const cacheKey = `cache:investments:${userEmail}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) return res.json(cachedData);

    const snapshot = await db.collection('users').doc(userEmail).collection('investments').get();
    const investments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    await setCache(cacheKey, investments);
    res.json(investments);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { assetId, symbol, name, type, amount, entryPrice, date } = req.body;
    
    const investmentData = {
      assetId, symbol, name, type,
      amount: parseFloat(amount) || 0,
      entryPrice: parseFloat(entryPrice) || 0,
      date: date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('users').doc(userEmail).collection('investments').add(investmentData);
    const doc = await docRef.get();
    
    await invalidateCache(`cache:investments:${userEmail}`);
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userEmail = req.user.email;
    const docRef = db.collection('users').doc(userEmail).collection('investments').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) return res.status(404).json({ error: 'Investment not found' });
    
    await docRef.delete();
    await invalidateCache(`cache:investments:${userEmail}`);
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
