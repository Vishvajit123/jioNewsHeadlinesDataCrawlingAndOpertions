// services/cronJob.js
import cron from 'node-cron';   //node pkg used to cron
import { getHeadlines } from '../controllers/headlineController.js';

const startCronJob = () => {
  // Schedule to run task every 15 minutes
  cron.schedule('*/1 * * * *', async () => {
    console.log('Running cron job to fetch and store headlines...');
    try {
      // Fetch the latest headlines with pagination from API and store them in MongoDB and Redis
      await getHeadlines(1, 50); //page =3,size - 50
      console.log('Headlines fetched and stored successfully.');
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });
};

export default startCronJob;
