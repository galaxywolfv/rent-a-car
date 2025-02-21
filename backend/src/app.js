const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { auth } = require('./middleware/auth');
require('./config/db.js');

const { API_NAME, API_VERSION } = process.env;
const app = express();

// CORS configuration
const corsOptions = {
  // origin: process.env.FRONTEND_URL,
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
  port: process.env.PORT || process.env.API_PORT || 4001,
};

// Rate limiting configuration: limit to 20 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 20, // max 20 requests per minute
  message: "Too many requests, please try again later.",
});

// Middleware setup
app.use(cors(corsOptions));
app.use(limiter);
app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// New Routes
app.use(`${API_VERSION}/users`, require('./routes/user.routes'));
app.use(`${API_VERSION}/cars`, require('./routes/car.routes'));
app.use(`${API_VERSION}/garages`, require('./routes/garage.routes'));
app.use(`${API_VERSION}/reservations`, require('./routes/reservation.routes'));
app.use(`${API_VERSION}/vehicles`, require('./routes/vehicle.routes'));

async function init() {
  try {
    // Root endpoint: Returns a welcome message
    app.get(`${API_VERSION}/`, (req, res) => {
      res.status(200).json(`Welcome to ${API_NAME}`);
    });

    // 404 catch-all route: Requires authentication and returns a standard error message
    app.use('*', auth, (req, res) => {
      res.status(404).json({
        success: 'false',
        message: 'Page not found',
        error: {
          statusCode: 404,
          message: 'There is nothing here...',
        },
      });
    });
  } catch (err) {
    console.error("Failed to start application", err);
    process.exit(1);
  }
}

init();

module.exports = app;
