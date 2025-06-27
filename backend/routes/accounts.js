const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();


async function accountExists(userEmail, accountName) {
  try {
    console.log(`Checking if account ${accountName} exists for user ${userEmail}`);
    const snapshot = await db.collection('users').doc(userEmail).collection('accounts')
      .where('accountName', '==', accountName).get();
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking account existence:', error);
    throw error;
  }
}


router.get('/', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`GET /api/accounts - Fetching accounts for user: ${userEmail}`);
    const snapshot = await db.collection('users').doc(userEmail).collection('accounts').get();
    const accounts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Found ${accounts.length} accounts for user ${userEmail}`);
    res.json(accounts);
  } catch (e) {
    console.error('Error in GET /api/accounts:', e);
    res.status(500).json({ error: e.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`POST /api/accounts - Request body for user ${userEmail}:`, req.body);
    
    if (!req.body.accountName) {
      return res.status(400).json({ error: 'accountName is required' });
    }
    
    if (await accountExists(userEmail, req.body.accountName)) {
      return res.status(409).json({ error: 'Account already exists for this user' });
    }
    
    console.log(`Adding new account to Firestore for user ${userEmail}...`);
    const { id, ...bodyWithoutId } = req.body;
    const accountData = {
      ...bodyWithoutId,
      balance: typeof req.body.balance === 'number' ? req.body.balance : parseFloat(req.body.balance) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('users').doc(userEmail).collection('accounts').add(accountData);
    const doc = await docRef.get();
    
    console.log('Account created successfully:', doc.id);
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (e) {
    console.error('Error in POST /api/accounts:', e);
    res.status(500).json({ error: e.message });
  }
});


router.patch('/:id', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`PATCH /api/accounts/:id - Request body for user ${userEmail}:`, req.body);
    
   
    const docRef = db.collection('users').doc(userEmail).collection('accounts').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log(`Account ${req.params.id} not found for user ${userEmail}`);
      return res.status(404).json({ error: 'Account not found' });
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
    
    console.log('Account updated successfully:', req.params.id);
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (e) {
    console.error('Error in PATCH /api/accounts/:id:', e);
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`DELETE /api/accounts/:id - Deleting account ${req.params.id} for user ${userEmail}`);
    

    const docRef = db.collection('users').doc(userEmail).collection('accounts').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log(`Account ${req.params.id} not found for user ${userEmail}`);
      return res.status(404).json({ error: 'Account not found' });
    }
    
    await docRef.delete();
    console.log('Account deleted successfully:', req.params.id);
    res.status(204).end();
  } catch (e) {
    console.error('Error in DELETE /api/accounts/:id:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;