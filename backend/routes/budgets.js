const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();


async function budgetExists(userEmail, category) {
  try {
    const snapshot = await db.collection('users').doc(userEmail).collection('budgets')
      .where('category', '==', category).get();
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking budget existence:', error);
    throw error;
  }
}


router.get('/', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`GET /api/budgets - Fetching budgets for user: ${userEmail}`);
    const snapshot = await db.collection('users').doc(userEmail).collection('budgets').get();
    const budgets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Found ${budgets.length} budgets for user ${userEmail}`);
    res.json(budgets);
  } catch (e) {
    console.error('Error in GET /api/budgets:', e);
    res.status(500).json({ error: e.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`POST /api/budgets - Request body for user ${userEmail}:`, req.body);
    
    if (!req.body.category || req.body.limit === undefined) {
      return res.status(400).json({ error: 'category and limit are required' });
    }
    
    if (await budgetExists(userEmail, req.body.category)) {
      return res.status(409).json({ error: 'Budget for this category already exists for this user' });
    }
    
    console.log(`Adding new budget to Firestore for user ${userEmail}...`);

    const { id, ...bodyWithoutId } = req.body;
    const budgetData = {
      ...bodyWithoutId,
      limit: typeof req.body.limit === 'number' ? req.body.limit : parseFloat(req.body.limit) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('users').doc(userEmail).collection('budgets').add(budgetData);
    const doc = await docRef.get();
    
    console.log('Budget created successfully:', doc.id);
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (e) {
    console.error('Error in POST /api/budgets:', e);
    res.status(500).json({ error: e.message });
  }
});


router.patch('/:id', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`PATCH /api/budgets/:id - Request body for user ${userEmail}:`, req.body);
    

    const docRef = db.collection('users').doc(userEmail).collection('budgets').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log(`Budget ${req.params.id} not found for user ${userEmail}`);
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    

    if (updateData.limit !== undefined) {
      updateData.limit = typeof updateData.limit === 'number' ? updateData.limit : parseFloat(updateData.limit) || 0;
    }
    
    await docRef.update(updateData);
    const updatedDoc = await docRef.get();
    
    console.log('Budget updated successfully:', req.params.id);
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (e) {
    console.error('Error in PATCH /api/budgets/:id:', e);
    res.status(500).json({ error: e.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    console.log(`DELETE /api/budgets/:id - Deleting budget ${req.params.id} for user ${userEmail}`);
    
    
    const docRef = db.collection('users').doc(userEmail).collection('budgets').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log(`Budget ${req.params.id} not found for user ${userEmail}`);
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    await docRef.delete();
    console.log('Budget deleted successfully:', req.params.id);
    res.status(204).end();
  } catch (e) {
    console.error('Error in DELETE /api/budgets/:id:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;