// models/headlineModel.js
import mongoose from 'mongoose';

const headlineSchema = new mongoose.Schema({
  title: String,
  headline: String,
  categoryTitle: String,
  publishedAt: String,
  publisherName: String,
  publisherLink: String,
  isViewed: {
    type: Boolean,
    default: false
  }
});

export const Headline = mongoose.model('Headline', headlineSchema);
