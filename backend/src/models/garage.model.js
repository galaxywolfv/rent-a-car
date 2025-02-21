const mongoose = require('mongoose');

const db = require("../config/db");

const garageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    // Reference to the maintainer (User) who manages this garage
    maintainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

module.exports = db.model("Garage", garageSchema);
