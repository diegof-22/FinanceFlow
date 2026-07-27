const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// Fallback: ensure critical env vars are loaded even in odd launch contexts.
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  try {
    if (fs.existsSync(envPath)) {
      const raw = fs.readFileSync(envPath, 'utf8');
      const parsed = dotenv.parse(raw);
      process.env.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || parsed.FIREBASE_PROJECT_ID;
      process.env.FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || parsed.FIREBASE_CLIENT_EMAIL;
      process.env.FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY || parsed.FIREBASE_PRIVATE_KEY;
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON =
        process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || parsed.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    }
  } catch (envError) {
    console.error('Error loading backend .env file:', envError.message);
  }
}
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios');

try {
  const normalizePrivateKey = (raw) => {
    if (!raw || typeof raw !== 'string') return '';

    // Remove optional surrounding quotes and normalize escaped newlines.
    let key = raw.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    key = key.replace(/\r/g, '').replace(/\\n/g, '\n').trim();

    if (key.includes('BEGIN PRIVATE KEY')) {
      return key;
    }

    // If only base64 body is provided, sanitize and rebuild a PEM key.
    const body = key.replace(/\s+/g, '');
    const chunkedBody = body.match(/.{1,64}/g)?.join('\n') || body;
    return `-----BEGIN PRIVATE KEY-----\n${chunkedBody}\n-----END PRIVATE KEY-----\n`;
  };

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  let credential;

  if (projectId && clientEmail && privateKeyRaw) {
    const normalizedPrivateKey = normalizePrivateKey(privateKeyRaw);

    credential = admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: normalizedPrivateKey,
    });
  } else if (serviceAccountJson) {
    const parsed = JSON.parse(serviceAccountJson);
    const normalizedPrivateKey = normalizePrivateKey(parsed.private_key || '');
    credential = admin.credential.cert({
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: normalizedPrivateKey,
    });
  } else {
    throw new Error(
      'Missing Firebase Admin env vars. Required FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY or GOOGLE_APPLICATION_CREDENTIALS_JSON'
    );
  }

  admin.initializeApp({
    credential
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
const marketRoutes = require('./routes/market');
const investmentsRoutes = require('./routes/investments');



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
app.use('/api/market', authenticateUser, marketRoutes);
app.use('/api/investments', authenticateUser, investmentsRoutes);


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




const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(` API running on http://localhost:${PORT}`);
}); 