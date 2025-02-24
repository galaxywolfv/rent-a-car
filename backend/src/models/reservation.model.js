const mongoose = require('mongoose');

const pictureSchema = require('./picture.model');
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
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['ongoing', 'cancelled', 'return_requested', 'return_rejected', 'completed'],
        default: 'ongoing',
    },
    pictures: [pictureSchema],
}, { timestamps: true });

// Ensure endDate is after startDate
reservationSchema.pre('save', function (next) {
    if (this.endDate <= this.startDate) {
        return next(new Error("endDate must be greater than startDate"));
    }
    next();
});

// Automatically move to return_requested when endDate is reached
reservationSchema.pre('save', function (next) {
    const now = new Date();
    if (this.status === 'ongoing' && now >= this.endDate) {
        this.status = 'return_requested';
    }
    next();
});

// Pre-save hook to automatically increment picture versions for new pictures
reservationSchema.pre('save', function (next) {
    // Only run if the pictures array was modified
    if (this.isModified('pictures')) {
        let maxVersion = 0;
        // Determine the highest version number currently in the array
        this.pictures.forEach(pic => {
            if (pic.version > maxVersion) {
                maxVersion = pic.version;
            }
        });
        // For each new picture (subdocument), assign a version that increments from maxVersion
        this.pictures.forEach(pic => {
            if (pic.isNew) {
                // If the picture already has a version greater than maxVersion, skip it.
                // Otherwise, assign a new version.
                if (!pic.version || pic.version <= maxVersion) {
                    pic.version = ++maxVersion;
                }
            }
        });
    }
    next();
});

// Instance methods for handling return requests
reservationSchema.methods.requestReturn = function () {
    if (this.status === 'ongoing') {
        this.status = 'return_requested';
    } else {
        throw new Error("Cannot request return unless reservation is ongoing.");
    }
};

reservationSchema.methods.approveReturn = function () {
    if (this.status === 'return_requested') {
        this.status = 'completed';
    } else {
        throw new Error("No return request to approve.");
    }
};

reservationSchema.methods.rejectReturn = function () {
    if (this.status === 'return_requested') {
        this.status = 'ongoing';
    } else {
        throw new Error("No return request to reject.");
    }
};

module.exports = db.model('Reservation', reservationSchema);
