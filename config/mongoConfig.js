// config/mongoConfig.js
import mongoose from 'mongoose';

const connectMongo = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/newsDB');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export { connectMongo }; 
