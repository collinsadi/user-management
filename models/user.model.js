const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true},
    email: { type: String, required: true},
    passwordHash: { type: String, required: true },
    firstName: String,
    lastName: String,
    newEmail: String,
    bio: String,
    country: String,
    profilePicture: String,
    badges: [String],
    subscriptionStatus: String,
    subscriptionExpiration: Date,
    blocked: Boolean,
    validated: Boolean,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followersCount: {
        type: Number,
        default: 0  
    },
    followingCount: {
        type: Number,
        default: 0  
    },
    projectsCount: {
        type: Number,
        default: 0
    },
    privateProjectsCount: {
        type: Number,
        default: 0
    },
    settings: {
        notificationPreferences: {
            email: Boolean,
            push: Boolean
        },
        privacySettings: {
            showEmail: Boolean,
            showLastActive: Boolean,
            privateProfile: Boolean,
            showFollowers: Boolean,
        }
    },
    validation: {
            token: String,
            expiresIn: Date
        }
    
}, { timestamps: true });

// Create a User model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
