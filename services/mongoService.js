//mongoService.js

import { Headline } from "../models/headlineModel.js";

const collectionName = 'newsHeadlines';

export async function saveNewsToMongo(newsData) {
  try {
    await Headline.insertMany(newsData);
    console.log('News saved to MongoDB');
  } catch (error) {
    console.error('MongoDB Save Error:', error);
  }
}

export async function getNewsFromMongo(page, size) {
  try {
    return await Headline.find()
    .skip((page - 1) * size).limit(size)
  } catch (error) {
    console.error('MongoDB Fetch Error:', error);
    return [];
  }
}
