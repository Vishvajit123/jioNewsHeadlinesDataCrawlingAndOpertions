//models/viewModels.js

import mongoose from 'mongoose';

const viewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  headlineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Headline',
    required: true,
  },
});

export const View = mongoose.model('View', viewSchema);
