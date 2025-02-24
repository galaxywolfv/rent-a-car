const mongoose = require('mongoose');
const db = require("../config/db");
const pictureSchema = require('./picture.model');

const BODY_TYPES = [
    "Compact",
    "Convertible",
    "Coupe",
    "SUV/Off-Road/Pick-up",
    "Station Wagon",
    "Sedan",
    "Other",
];

const FUEL_TYPES = [
    "Hybrid (Electric/Gasoline)",
    "Hybrid (Electric/Diesel)",
    "Gasoline",
    "CNG",
    "Diesel",
    "Electric",
    "Hydrogen",
    "LPG",
    "Ethanol",
    "Other",
];

const GEAR_TYPES = ["Manual", "Automatic", "Semiautomatic"];

// Main Car schema
const carSchema = new mongoose.Schema(
    {
        make: {
            type: String,
            required: true,
            trim: true,
        },
        model: {
            type: String,
            required: true,
            trim: true,
        },
        bodyType: {
            type: String,
            enum: BODY_TYPES,
            required: true,
        },
        fuelType: {
            type: String,
            enum: FUEL_TYPES,
            required: true,
        },
        firstRegistration: {
            type: Number,
            min: 1886,
            max: new Date().getFullYear(),
            required: true,
        },
        powerHP: {
            type: Number,
            min: 1,
            required: true,
        },
        gear: {
            type: String,
            enum: GEAR_TYPES,
            required: true,
        },
        mileage: {
            type: Number,
            default: 0,
        },
        garage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Garage',
            required: true,
        },
        pictures: [pictureSchema],
    },
    { timestamps: true }
);

/**
 * Pre-save hook to automatically increment version numbers for new pictures.
 * When new picture objects are added to the `pictures` array, this hook finds
 * the highest existing version and assigns subsequent version numbers to the new ones.
 */
carSchema.pre('save', function (next) {
    if (this.isModified('pictures') && this.pictures && this.pictures.length > 0) {
        // Get the current highest version among all pictures
        const currentMaxVersion = this.pictures.reduce((max, pic) => {
            return pic.version && pic.version > max ? pic.version : max;
        }, 0);

        let nextVersion = currentMaxVersion;
        // For each new picture, if no version is specified or it's not higher than current max,
        // assign the next version number.
        this.pictures.forEach(pic => {
            if (pic.isNew && (!pic.version || pic.version <= currentMaxVersion)) {
                nextVersion++;
                pic.version = nextVersion;
            }
        });
    }
    next();
});

module.exports = db.model('Car', carSchema);
