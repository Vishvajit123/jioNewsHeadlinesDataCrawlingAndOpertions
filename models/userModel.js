// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        viewedNews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Headline"
        }]
},{timestamps: true})

export const User = mongoose.model("User", userSchema);
