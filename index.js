// index.js
import express from 'express';
import { connectMongo } from './config/mongoConfig.js';
import { connectRedis } from './config/redisConfig.js';
import startCronJob from './services/cronJob.js';
import dotenv from 'dotenv';

dotenv.config();

// Import routes
import headlineRoutes from './routes/headlineRoutes.js';
import userRoutes from './routes/userRoutes.js';
import viewRoutes from './routes/viewRoutes.js'; 

const app = express();
// const port = 3000;
const port = process.env.PORT || 3000 ;

app.use(express.json());

// Use routes
app.use('/api', headlineRoutes);
app.use('/api/users', userRoutes);
app.use('/api/views', viewRoutes);

async function startServer() {
  await connectMongo();
  await connectRedis();

// start the cron job
  startCronJob();
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
