const IORedis = require('ioredis');

const RedisManager = new IORedis({
  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 50, 2000), // Exponential backoff
  keepAlive: 10000, // Send a ping every 10 seconds
  
  // 'redis://localhost:6379',
},'rediss://default:AVNS_0WDCTxpoCRCt-oTO-e_@caching-8d0912f-testtust21-e578.h.aivencloud.com:11860');

// Handle errors and reconnections
RedisManager.on('error', (err) => {
  console.error('Redis error:', err);
});

RedisManager.on('end', () => {
  console.log('Redis connection ended. Reconnecting...');
  RedisManager.connect().catch(err => console.error('Reconnection error:', err));
});

module.exports = RedisManager;
