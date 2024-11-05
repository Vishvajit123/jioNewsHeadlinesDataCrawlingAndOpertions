// services/mongoService.js
import { Headline } from "../models/headlineModel.js";

// Collection name
const collectionName = 'newsHeadlines';

// Function to save an array of news data to MongoDB
export async function saveNewsToMongo(newsData) {
  try {
    // Insert multiple news items into the 'Headline' collection
    await Headline.insertMany(newsData);
    console.log('News saved to MongoDB');
  } catch (error) {
    console.error('MongoDB Save Error:', error);
  }
}

// Function to fetch paginated news from MongoDB
export async function getNewsFromMongo(page, size) {
  try {
    // Retrieve paginated news data, skip headlines based on page and limit results by size
    return await Headline.find()
    .skip((page - 1) * size).limit(size)
  } catch (error) {
    console.error('MongoDB Fetch Error:', error);
    return [];
  }
}
