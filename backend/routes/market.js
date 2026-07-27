const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getCache, setCache } = require('../services/cacheService');

// Proxy for Trending Coins
router.get('/trending', async (req, res) => {
  try {
    const cacheKey = 'market:trending';
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Call CoinGecko API
    const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
    const data = response.data.coins.slice(0, 4).map(c => ({
      id: c.item.id,
      name: c.item.name,
      symbol: c.item.symbol,
      thumb: c.item.thumb,
      price: c.item.data.price,
      priceChange24h: c.item.data.price_change_percentage_24h.usd
    }));

    // Cache for 5 minutes
    await setCache(cacheKey, data, 300);
    res.json(data);
  } catch (error) {
    console.error('Error fetching trending market data:', error.message);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Proxy for Top Coins Market Data
router.get('/coins', async (req, res) => {
  try {
    const cacheKey = 'market:coins';
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: false
      }
    });

    const data = response.data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      price: coin.current_price,
      marketCap: coin.market_cap,
      volume: coin.total_volume,
      change24h: coin.price_change_percentage_24h
    }));

    // Cache for 60 seconds (1 minute) for live-ish prices
    await setCache(cacheKey, data, 60);
    res.json(data);
  } catch (error) {
    console.error('Error fetching coins market data:', error.message);
    res.status(500).json({ error: 'Failed to fetch coins data' });
  }
});

module.exports = router;
