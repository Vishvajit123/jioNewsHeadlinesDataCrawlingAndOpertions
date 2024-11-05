import express from 'express';
import { createView, getHeadlineViewCount, getUserViewedHeadlines } from '../controllers/viewController.js';

const router = express.Router();

// Route to create a new view
router.post('/', createView);

// Route to get the total view count for a specific headline
router.get('/count/:headlineId', getHeadlineViewCount);

// Route to get all viewed headlines for a specific user
router.get('/user/:userId', getUserViewedHeadlines);

export default router;
