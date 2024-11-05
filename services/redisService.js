// services/redisService.js
import { redisClient } from '../config/redisConfig.js';

// Function to push data into a Redis queue
export async function pushToQueue(queueName, data) {
  try {
    await redisClient.rPush(queueName, JSON.stringify(data));
  } catch (error) {
    console.error('Error pushing data to Redis:', error);
  }
}
