// index.js
import express from 'express';
import { connectMongo } from './config/mongoConfig.js';
import { connectRedis } from './config/redisConfig.js';

// Import routes
import headlineRoutes from './routes/headlineRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = 3000;

app.use(express.json());

// Use routes
app.use('/api', headlineRoutes);
app.use('/api/users', userRoutes);

async function startServer() {
  await connectMongo();
  await connectRedis();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
