// controllers/headlineController.js
import { redisClient } from '../config/redisConfig.js';
import { Headline } from '../models/headlineModel.js';
import { fetchHeadlinesFromAPI } from '../services/apiService.js';
import { sendResponse } from '../utils/apiResponse.js';
import { logError } from '../utils/commanError.js';
// import { User } from '../models/userModel.js';
// import { pushToQueue } from '../services/redisService.js';




// Controller to fetch and return headlines with pagination support
export const getHeadlinesController = async (req, res) => {
  const { page=1, size=50 } = req.query;
  try {
    const headlines = await getHeadlines(parseInt(page), parseInt(size));
    // res.status(200).json(headlines); // Send headlines in response
    sendResponse(res, 200, "Headlines Fetched Successfully", headlines);
  } catch (error) {
    // console.error('Error fetching headlines:', error);
    logError(error);
    // res.status(500).json({ message: 'Failed to fetch headlines', error: error.message });
    sendResponse(res, 500, "Failed to fetch headlines", error.message)
  }
};






// Fetches headlines , appling caching nd update MongoDB if needede
export const getHeadlines = async (page, requestedSize) => {
  const standardSize = 50; // Define a standard size for API fetches
  //Redis key for caching by page
  const redisKey = `headlines:page:${page}`;

  // Fetch new data from the API for current Page
  const apiData = await fetchHeadlinesFromAPI(page, standardSize);
  const filteredHeadlines = apiData.map((brief) => ({
      id: brief.id,
      title: brief.title,
      headline: brief.headline,
      categoryTitle: brief.category?.title,
      publishedAt: brief.publishedAt?.prettyDateTime,
      publisherName: brief.publisher?.name,
      publisherLink: brief.publisherLink,
  }));

  // Insert/update in MongoDB if headlines are new
  for (const headline of filteredHeadlines) {
      const { id, ...headlineData } = headline; // Remove `id` before saving to MongoDB
      await Headline.updateOne(
          { title: headlineData.title }, // Use title or any unique field for identification
          { $set: headlineData },
          { upsert: true }
      );
  }

  // Check existing Redis sorted set to avoid duplicate entries
  const existingHeadlines = await redisClient.zRange(redisKey, 0, -1);
  const existingIds = new Set(existingHeadlines.map((item) => JSON.parse(item).id));

  // Add only new headlines to Redis sorted set with timeStamp score
  for (const headline of filteredHeadlines) {
      if (!existingIds.has(headline.id)) {
          // Parse publishedAt into a valid Date object
          const publishedAtString = headline.publishedAt;
          const publishedAtDate = new Date(publishedAtString.replace(/(\d{1,2}):(\d{2})([ap]m) (\d{1,2} \w{3} \d{4})/, (match, hour, minute, period, date) => {
              // Convert to a 24-hour format
              hour = period === 'pm' && hour !== '12' ? parseInt(hour) + 12 : hour;
              hour = period === 'am' && hour === '12' ? '00' : hour;
              return `${hour}:${minute} ${date}`;
          }));
          // Convert date to a numeric timestamp in seconds
          const score = Math.floor(publishedAtDate.getTime() / 1000);
          // const score = publishedAtDate.getTime();
          // console.log(score.toString());
          // Only add valid scores
          if (!isNaN(score)) { // Ensure the score is valid
              await redisClient.zAdd(redisKey, { score, value: JSON.stringify(headline) });
          } else {
              console.error(`Invalid publishedAt date for headline: ${JSON.stringify(headline)}`);
          }
      }
  }
  // Retrieve and return the sorted set of headlines based on requested size
  const finalHeadlines = await redisClient.zRange(redisKey, 0, requestedSize - 1);

  // Convert each JSON string back to an object for the response
  return finalHeadlines.map((headline) => JSON.parse(headline));
};





// Controller to get single headline by ID
export const getHeadlineById = async (req, res) => {
  const { id } = req.params; //get id from req.parameter
  try {
    // Unique Redis key for the headline
    const redisKey = `headlineById:${id}`;

    // Check if the headline is cached in Redis
    const cachedHeadline = await redisClient.get(redisKey);
    if (cachedHeadline) {
      // return res.status(200).json(JSON.parse(cachedHeadline));// Return cached headline
    return sendResponse(res, 200, JSON.parse(cachedHeadline));
    }

    // Fetch from MongoDB if not found in Redis
    const headline = await Headline.findById(id);
    if (!headline) {
      // return res.status(404).json({ message: 'Headline not found' });
      return sendResponse(res, 404, "Headline not found");
    }

    // Cache the headline in Redis for future requests
    await redisClient.set(redisKey, JSON.stringify(headline));

    // res.status(200).json(headline); // Return the headline 
    return sendResponse(res, 200, headline)
  } catch (error) {
    console.error('Error fetching headline by ID:', error);
    // logError(error);
    // res.status(500).json({ message: 'Error fetching headline by ID', error: error.message });
    return sendResponse(res, 500, "Error fetching headline by ID", error.message)
  }
};












// Controller to mark a headline as viewed by a user
// export const viewNews = async (req, res) => {
//   const { userId, headlineId } = req.body;

//   try {
//     // Retrieve the headline from MongoDB to ensure it exists
//     const headlineItem = await Headline.findById(headlineId);
//     if (!headlineItem) {
//       return res.status(404).json({ message: 'Headline not found'});
//     }

//     // Mark the headline as viewed and save the update in MongoDB
//     headlineItem.isViewed = true;
//     // Save the updated headline back to MongoDB.
//     await headlineItem.save();

//     // Update the user's viewedNews arrayy
//     await User.findByIdAndUpdate(userId, { $addToSet: { viewedNews: headlineId } });

//     // Push headline to the Redis queue
//     await pushToQueue(`user:${userId}:viewedNews`, headlineId);

//     res.status(200).json({ message: 'Headline marked as viewed.' });
//   } catch (error) {
//     console.error('Error marking headline as viewed:', error);
//     res.status(500).json({ message: 'Error marking headline as viewed.'});
//   }
// };