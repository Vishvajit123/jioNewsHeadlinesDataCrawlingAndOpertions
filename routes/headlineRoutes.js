// routes/headlineRoutes.js
import express from "express";
import { getHeadlinesController,getHeadlineById} from '../controllers/headlineController.js';

const router = express.Router();

// Route to get headlines
router.get('/headlines', getHeadlinesController);
// Route to get headline by id
router.get('/:id', getHeadlineById);
// Route to mark news as viewed
// router.post('/view', viewNews);

export default router;
