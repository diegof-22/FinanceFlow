const { getCache, setCache, invalidateCache, client } = require('../services/cacheService');

describe('Cache Service', () => {
  afterEach(async () => {
    if (client.quit) {
      await client.quit();
    }
  });

  it('should return null for missing key', async () => {
    const cachedData = await getCache('missing-key');
    expect(cachedData).toBeNull();
  });

  it('should set and get cache', async () => {
    const key = 'test-key';
    const data = { id: 1, name: 'Test' };

    await setCache(key, data, 10);
    const cachedData = await getCache(key);

    expect(cachedData).toEqual(data);
  });

  it('should invalidate cache', async () => {
    const key = 'test-key-2';
    const data = { id: 2, name: 'Test 2' };

    await setCache(key, data, 10);
    let cachedData = await getCache(key);
    expect(cachedData).toEqual(data);

    await invalidateCache(key);
    cachedData = await getCache(key);
    expect(cachedData).toBeNull();
  });
});
