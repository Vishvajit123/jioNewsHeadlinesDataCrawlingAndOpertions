// headlineController.js
import { redisClient } from '../config/redisConfig.js';
import { Headline } from '../models/headlineModel.js';
import { fetchHeadlinesFromAPI } from '../services/apiService.js';
import { User } from '../models/userModel.js';
import { pushToQueue } from '../services/redisService.js';


export const getHeadlinesController = async (req, res) => {
  const { page=1, size=10 } = req.query;

  try {
    const headlines = await getHeadlines(parseInt(page), parseInt(size));
    res.status(200).json(headlines);
  } catch (error) {
    console.error('Error fetching headlines:', error);
    res.status(500).json({ message: 'Failed to fetch headlines', error: error.message });
  }
};

export const getHeadlines = async (page, size) => {
  // Create a unique Redis key using the page and size values to store and retrieve the cached data.
  const redisKey = `headlines:page:${page}:size:${size}`;

  // Check in Redis
  const cachedData = await redisClient.get(redisKey);
  // If cached data exists, parse it from JSON format and return it
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Fetch from the API
  const apiData = await fetchHeadlinesFromAPI(page, size);
  const filteredHeadlines = apiData.map((brief) => ({
    title: brief.title,
    headline: brief.headline,
    categoryTitle: brief.category?.title,
    publishedAt: brief.publishedAt?.prettyDateTime,
    publisherName: brief.publisher?.name,
    publisherLink: brief.publisherLink,
  }));

  // Insert into MongoDB if not existing
  for (const headline of filteredHeadlines) {
    // Check if a headline doq with same title already exists in MongoDB
    const existingHeadline = await Headline.findOne({ title: headline.title });
    // if not then create new document -headline
    if (!existingHeadline) {
      await Headline.create(headline);
      // Headline.create(headline) not only creates a new document in MongoDB but also inserts the data from the API into the MongoDB collection
    }
  }

  // Cache the data in Redis as a JSON string using redisKey
  await redisClient.set(redisKey, JSON.stringify(filteredHeadlines));

  return filteredHeadlines;
};

// function to handle marking news as viewed
export const viewNews = async (req, res) => {
  const { userId, headlineId } = req.body;

  try {
    const headlineItem = await Headline.findById(headlineId);
    if (!headlineItem) {
      return res.status(404).json({ message: 'Headline not found'});
    }

    // Mark headline as viewed
    headlineItem.isViewed = true;
    // Save the updated headline back to MongoDB.
    await headlineItem.save();

    // Add Document(headline) to user's viewedNews array
    await User.findByIdAndUpdate(userId, { $addToSet: { viewedNews: headlineId } });

    // Push headline to the Redis queue
    await pushToQueue(`user:${userId}:viewedNews`, headlineId);

    res.status(200).json({ message: 'Headline marked as viewed.' });
  } catch (error) {
    console.error('Error marking headline as viewed:', error);
    res.status(500).json({ message: 'Error marking headline as viewed.' });
  }
};

