//controllers/viewControllers.js

import { View } from '../models/viewModel.js';
import { Headline } from '../models/headlineModel.js';
import { User } from '../models/userModel.js';
import { redisClient } from '../config/redisConfig.js';
import { sendResponse } from '../utils/apiResponse.js';
import { logError } from '../utils/commanError.js';


// Controller to record a new view for a headline by a specific user
export const createView = async (req, res) => {
  const { userId, headlineId } = req.body;

  try {
    // Check if the headline exists in mongo
    const headline = await Headline.findById(headlineId);
    if (!headline) {
      // return res.status(404).json({ message: 'Headline not found' });
      return sendResponse(res, 404, "Headline Not Found");
    }

    // Check if the user exists in mongo
    const user = await User.findById(userId);
    if (!user) {
      // return res.status(404).json({ message: 'User not found' });
      return sendResponse(res, 404, "User Not Found");
    }

    // Create a new view record in MongoDB
    const newView = new View({ userId, headlineId });
    await newView.save();

    // Redis key for storing view counts for each headline
    const viewCountKey = 'viewCount';
    
    // Increment the view count for the headline in Redis
    // Using hIncrBy ensures that each headline has a unique count in a hash
    await redisClient.hIncrBy(viewCountKey, `headline:${headlineId}`, 1);

    // Track viewed headlines for the user in Redis using a set
    // Each user will have a set of headline IDs they've viewed
    const userViewsKey = `userViews:${userId}`;
    await redisClient.sAdd(userViewsKey, String(headlineId));

    // res.status(201).json({ message: 'View recorded successfully', view: newView });
    return sendResponse(res, 201, 'View Recorded Successfully', newView);
  } catch (error) {
    console.error('Error creating view:', error);
    // logError(error);
    // res.status(500).json({ message: 'Error creating view', error: error.message });
    return sendResponse(res, 500, "Error creating view",  error.message);
  }
};





// Controller to get the view count for a specific headline
export const getHeadlineViewCount = async (req, res) => {
  const { headlineId } = req.params;

  try {
    // Redis hash key where view counts are stored
    const viewCountKey = 'viewCount';
    // Retrieve the view count for the specific headline ID from Redis
    const viewCount = await redisClient.hGet(viewCountKey, `headline:${headlineId}`);
    // res.status(200).json({ headlineId, viewCount: viewCount || 0 });
    return sendResponse(res, 200, "ViewCount Of Perticular Headline ", "viewCount :"+ viewCount || 0);
  } catch (error) {
    console.error('Error fetching view count', error);
    // logError(error);
    // res.status(500).json({ message: 'Error fetching view count', error: error.message });
    return sendResponse(res, 500, "Error fetching view count", error.message);
  }
};




// Controller to get all headlines viewed by a specific user
export const getUserViewedHeadlines = async (req, res) => {
  const { userId } = req.params;
  try {
    // Redis key where user's viewed headlines are stored
    const userViewsKey = `userViews:${userId}`;
    // Retrieve all headline IDs that the user has viewed from Redis
    const viewedHeadlines = await redisClient.sMembers(userViewsKey);
    // res.status(200).json({ userId, viewedHeadlines });
    return sendResponse(res, 200, "Viewed Headlins By User", viewedHeadlines);
  } catch (error) {
    console.error('Error fetching user viewed headlines:', error);
    // res.status(500).json({ message: 'Error fetching user viewed headlines', error: error.message });
    return sendResponse(res, 500, "Error Fetching User Viewed Headlines", error.message);
  }
};