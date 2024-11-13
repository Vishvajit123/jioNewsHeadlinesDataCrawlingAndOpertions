// config/redisConfig.js
import { createClient } from 'redis';

const redisClient = createClient({
  // url: 'redis://localhost:6379',
  url: process.env.REDIS_URI,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
};

export { redisClient, connectRedis };
