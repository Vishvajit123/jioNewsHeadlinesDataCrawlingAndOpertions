// // models/headlineModel.js
// import mongoose from 'mongoose';

// const headlineSchema = new mongoose.Schema({
//   title: String,
//   headline: String,
//   categoryTitle: String,
//   publishedAt: String,
//   publisherName: String,
//   publisherLink: String,
//   isViewed: {
//     type: Boolean,
//     default: false
//   }
// });

// export const Headline = mongoose.model('Headline', headlineSchema);





// models/headlineModel.js
import mongoose from 'mongoose';

const headlineSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true, // Ensure this id is unique across your documents
  },
  title: { type: String, required: true },
  headline: { type: String, required: true },
  categoryTitle: { type: String },
  publishedAt: { type: String },
  publisherName: { type: String },
  publisherLink: { type: String },
  isViewed: {
    type: Boolean,
    default: false
  }
});

export const Headline = mongoose.model('Headline', headlineSchema);
