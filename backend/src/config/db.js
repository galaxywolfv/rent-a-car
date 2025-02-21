const mongoose = require('mongoose');
const { MONGO_URI, API_NAME } = process.env;

const db = mongoose.createConnection(MONGO_URI);

db.on('connected', () => console.log(`Successfully connected to \x1b[32m${API_NAME}\x1b[0m`));
db.on('error', err => console.error(`Failed to connect to \x1b[31m${API_NAME}\x1b[0m\n`, err));

module.exports = db;
