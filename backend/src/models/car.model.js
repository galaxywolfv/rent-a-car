const mongoose = require('mongoose');

const db = require("../config/db");

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
        image: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = db.model('Car', carSchema);
