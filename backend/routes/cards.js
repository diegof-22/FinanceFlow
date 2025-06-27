const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();


async function cardExists(userEmail, cardName) {
  try {
    console.log(`Checking if card ${cardName} exists for user ${userEmail}`);
    const snapshot = await db.collection('users').doc(userEmail).collection('cards')
      .where('cardName', '==', cardName).get();
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking card existence:', error);
    throw error;
  }
}


router.get('/', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`GET /api/cards - Fetching cards for user: ${userEmail}`);
    const snapshot = await db.collection('users').doc(userEmail).collection('cards').get();
    const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Found ${cards.length} cards for user ${userEmail}`);
    res.json(cards);
  } catch (e) {
    console.error('Error in GET /api/cards:', e);
    res.status(500).json({ error: e.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`POST /api/cards - Request body for user ${userEmail}:`, req.body);
    
    if (!req.body.cardName) {
      return res.status(400).json({ error: 'cardName is required' });
    }
    
    if (await cardExists(userEmail, req.body.cardName)) {
      return res.status(409).json({ error: 'Card already exists for this user' });
    }
    
    console.log(`Adding new card to Firestore for user ${userEmail}...`);
 
    const { id, ...bodyWithoutId } = req.body;
    const cardData = {
      ...bodyWithoutId,
      balance: typeof req.body.balance === 'number' ? req.body.balance : parseFloat(req.body.balance) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('users').doc(userEmail).collection('cards').add(cardData);
    const doc = await docRef.get();
    
    console.log('Card created successfully:', doc.id);
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (e) {
    console.error('Error in POST /api/cards:', e);
    res.status(500).json({ error: e.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`PATCH /api/cards/:id - Request body for user ${userEmail}:`, req.body);
    
    
    const docRef = db.collection('users').doc(userEmail).collection('cards').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log(`Card ${req.params.id} not found for user ${userEmail}`);
      return res.status(404).json({ error: 'Card not found' });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    if (updateData.balance !== undefined) {
      updateData.balance = typeof updateData.balance === 'number' ? updateData.balance : parseFloat(updateData.balance) || 0;
    }
    
    await docRef.update(updateData);
    const updatedDoc = await docRef.get();
    
    console.log('Card updated successfully:', req.params.id);
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (e) {
    console.error('Error in PATCH /api/cards/:id:', e);
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`DELETE /api/cards/:id - Deleting card ${req.params.id} for user ${userEmail}`);
    
    
    const docRef = db.collection('users').doc(userEmail).collection('cards').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log(`Card ${req.params.id} not found for user ${userEmail}`);
      return res.status(404).json({ error: 'Card not found' });
    }
    
    await docRef.delete();
    console.log('Card deleted successfully:', req.params.id);
    res.status(204).end();
  } catch (e) {
    console.error('Error in DELETE /api/cards/:id:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;