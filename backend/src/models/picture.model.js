const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pictureSchema = new Schema({
    url: { type: String, required: true },
    version: { type: Number, required: true, default: 1 },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = pictureSchema;
