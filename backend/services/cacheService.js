const redis = require('redis');

let client;
let isConnected = false;

// Use redis-mock for testing
if (process.env.NODE_ENV === 'test') {
  const store = new Map();
  client = {
    get: async (key) => store.get(key) || null,
    setEx: async (key, ttl, value) => { store.set(key, value); return 'OK'; },
    del: async (key) => { store.delete(key); return 1; },
    on: () => {},
    connect: async () => {},
    quit: async () => { store.clear(); }
  };
  isConnected = true;
} else {
  client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      reconnectStrategy: false
    }
  });

  client.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
      console.warn('⚠️ Impossibile connettersi a Redis. La cache sarà disabilitata.');
    } else {
      console.error('Redis Client Error:', err.message);
    }
    isConnected = false;
  });

  client.on('connect', () => {
    console.log('Connected to Redis cache');
    isConnected = true;
  });

  // Non-blocking connect
  client.connect().catch(() => {
    // Error is already logged by the error listener, nothing to do here
  });
}

/**
 * Get data from cache
 * @param {string} key 
 * @returns {Promise<any|null>} parsed JSON data or null
 */
const getCache = async (key) => {
  if (!isConnected) return null;
  try {
    const data = await client.get(key);
    if (data) {
      console.log(`Cache HIT: ${key}`);
      return JSON.parse(data);
    }
    console.log(`Cache MISS: ${key}`);
    return null;
  } catch (error) {
    console.error(`Error reading cache for ${key}:`, error.message);
    return null;
  }
};

/**
 * Set data in cache
 * @param {string} key 
 * @param {any} data 
 * @param {number} ttlSeconds - Time to live in seconds (default 300 = 5 mins)
 */
const setCache = async (key, data, ttlSeconds = 300) => {
  if (!isConnected) return;
  try {
    await client.setEx(key, ttlSeconds, JSON.stringify(data));
    console.log(`Cache SET: ${key}`);
  } catch (error) {
    console.error(`Error setting cache for ${key}:`, error.message);
  }
};

/**
 * Invalidate (delete) cache key
 * @param {string} key 
 */
const invalidateCache = async (key) => {
  if (!isConnected) return;
  try {
    await client.del(key);
    console.log(`Cache INVALIDATED: ${key}`);
  } catch (error) {
    console.error(`Error invalidating cache for ${key}:`, error.message);
  }
};

module.exports = {
  getCache,
  setCache,
  invalidateCache,
  client
};
