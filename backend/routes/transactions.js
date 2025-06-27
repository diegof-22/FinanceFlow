const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

async function transactionExists(userEmail, timestamp) {
  try {
    console.log(`Checking if transaction with timestamp ${timestamp} exists for user ${userEmail}`);
    const snapshot = await db.collection('users').doc(userEmail).collection('transactions')
      .where('timestamp', '==', timestamp).get();
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking transaction existence:', error);
    throw error;
  }
}

router.get('/', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`GET /api/transactions - Fetching transactions for user: ${userEmail}`);
    const snapshot = await db.collection('users').doc(userEmail).collection('transactions').get();
    const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Found ${transactions.length} transactions for user ${userEmail}`);
    res.json(transactions);
  } catch (e) {
    console.error('Error in GET /api/transactions:', e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`POST /api/transactions - Request body for user ${userEmail}:`, req.body);
    
    if (!req.body.amount || !req.body.type || !req.body.date) {
      return res.status(400).json({ error: 'amount, type, and date are required' });
    }
    
    if (req.body.timestamp && await transactionExists(userEmail, req.body.timestamp)) {
      return res.status(409).json({ error: 'Transaction already exists for this user' });
    }
    
    console.log(`Adding new transaction to Firestore for user ${userEmail}...`);
   
    const { id, ...bodyWithoutId } = req.body;
    const transactionData = {
      ...bodyWithoutId,
      amount: typeof req.body.amount === 'number' ? req.body.amount : parseFloat(req.body.amount) || 0,
      timestamp: req.body.timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('users').doc(userEmail).collection('transactions').add(transactionData);
    const doc = await docRef.get();
    
    console.log('Transaction created successfully:', doc.id);
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (e) {
    console.error('Error in POST /api/transactions:', e);
    res.status(500).json({ error: e.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`PATCH /api/transactions/:id - Request body for user ${userEmail}:`, req.body);
    
    const docRef = db.collection('users').doc(userEmail).collection('transactions').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log(`Transaction ${req.params.id} not found for user ${userEmail}`);
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    if (updateData.amount !== undefined) {
      updateData.amount = typeof updateData.amount === 'number' ? updateData.amount : parseFloat(updateData.amount) || 0;
    }
    
    await docRef.update(updateData);
    const updatedDoc = await docRef.get();
    
    console.log('Transaction updated successfully:', req.params.id);
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (e) {
    console.error('Error in PATCH /api/transactions/:id:', e);
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`DELETE /api/transactions/:id - Deleting transaction ${req.params.id} for user ${userEmail}`);
    
    const docRef = db.collection('users').doc(userEmail).collection('transactions').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log(`Transaction ${req.params.id} not found for user ${userEmail}`);
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    await docRef.delete();
    console.log('Transaction deleted successfully:', req.params.id);
    res.status(204).end();
  } catch (e) {
    console.error('Error in DELETE /api/transactions/:id:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;