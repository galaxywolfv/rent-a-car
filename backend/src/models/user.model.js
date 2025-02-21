const mongoose = require('mongoose');

const db = require("../config/db");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        set: (value) => value.toLowerCase(),
        maxlength: 30,
    },
    password: {
        type: String,
        required: true,
        maxlength: 256,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        set: (value) => value.toLowerCase(),
        maxlength: 50,
    },
    role: {
        type: String,
        enum: ['user', 'maintainer', 'admin'],
        default: 'user',
    },
}, { timestamps: true });

module.exports = db.model("User", userSchema);
