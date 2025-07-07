require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios');

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  });
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

const auth = admin.auth();

const app = express();


const cardsRoutes = require('./routes/cards');
const accountsRoutes = require('./routes/accounts');
const transactionsRoutes = require('./routes/transactions');
const budgetsRoutes = require('./routes/budgets');
const webpushRoutes = require('./routes/webpush');


app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    res.status(504).json({ error: 'Request timeout' });
  });
  next();
});


const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email?.split('@')[0]
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};


const logRequest = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

app.use(logRequest);

app.use('/api/cards', authenticateUser, cardsRoutes);
app.use('/api/accounts', authenticateUser, accountsRoutes);
app.use('/api/transactions', authenticateUser, transactionsRoutes);
app.use('/api/budgets', authenticateUser, budgetsRoutes);
app.use('/api/webpush', authenticateUser, webpushRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});


app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});


async function getAdminCustomToken() {
  const adminEmail = 'test@prova.com';
  try {
    const userRecord = await admin.auth().getUserByEmail(adminEmail);
    const uid = userRecord.uid;
    const customToken = await admin.auth().createCustomToken(uid);
    return customToken;
  } catch (error) {
    console.error('Errore generazione custom token:', error);
    return null;
  }
}

async function getIdTokenFromCustomToken(customToken) {
  const apiKey = process.env.FIREBASE_API_KEY; 
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`;
  try {
    const response = await axios.post(url, {
      token: customToken,
      returnSecureToken: true
    });
    return response.data.idToken;
  } catch (error) {
    console.error('Errore scambio custom token per ID token:', error.response?.data || error.message);
    return null;
  }
}


async function sendScheduledNotification(){
  try {
    const customToken = await getAdminCustomToken();
    if (!customToken) throw new Error('Custom token non ottenuto');
    const idToken = await getIdTokenFromCustomToken(customToken);
    if (!idToken) throw new Error('ID token non ottenuto');

    await axios.post(
      'http://localhost:5000/api/webpush/send-all',
      {
        notification: {
          title: 'Ricordati di aggiungere i nuovi pagamenti!',
          body: 'Questa è una notifica inviata automaticamente ogni 2 minuti!',
          url: '/dashboard'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    );
  } catch (error) {
    console.error('Errore nell\'invio della notifica programmata:', error.response?.data || error.message);
  }
}

//setInterval(sendScheduledNotification, 2* 60 * 1000);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` API running on http://localhost:${PORT}`);
}); 