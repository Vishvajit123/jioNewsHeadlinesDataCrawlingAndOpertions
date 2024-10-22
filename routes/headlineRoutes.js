// routes/headlineRoutes.js
import express from "express";
import { getHeadlinesController, viewNews } from '../controllers/headlineController.js';

const router = express.Router();

// Route to get headlines
router.get('/headlines', getHeadlinesController);  

// Route to mark news as viewed
router.post('/view', viewNews);

export default router;
