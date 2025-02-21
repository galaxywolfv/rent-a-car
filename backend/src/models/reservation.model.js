const mongoose = require('mongoose');

const db = require("../config/db");

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
    },
    // Start and end dates for the reservation period
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    // Reservation status
    status: {
        type: String,
        enum: ['ongoing', 'expired'],
        default: 'ongoing',
    },
}, { timestamps: true });

// Validation to ensure endDate is after startDate
reservationSchema.pre('save', function (next) {
    if (this.endDate <= this.startDate) {
        return next(new Error("endDate must be greater than startDate"));
    }
    next();
});

// Optionally, add indexes for faster queries
reservationSchema.index({ user: 1 });
reservationSchema.index({ car: 1 });
reservationSchema.index({ startDate: 1, endDate: 1 });

module.exports = db.model('Reservation', reservationSchema);
