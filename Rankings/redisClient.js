// redisClient.js
const redis = require('redis');

// Khởi tạo Redis client
const redisClient = redis.createClient();

// Xử lý lỗi khi kết nối Redis
redisClient.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

module.exports = redisClient;