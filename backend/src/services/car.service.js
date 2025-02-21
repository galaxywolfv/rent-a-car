const Car = require('../models/car.model');
const Garage = require('../models/garage.model');
const Reservation = require('../models/reservation.model');

async function addCar(carData, user) {
    if (user.role === 'maintainer') {
        // Fetch the garage managed by this user
        const managedGarage = await Garage.findOne({ maintainer: user.id || user._id });
        if (!managedGarage) {
            throw new Error('No garage found for this maintainer');
        }
        // Automatically assign the managed garage's id
        carData.garage = managedGarage._id;
    }

    // Create the new car
    const newCar = await Car.create(carData);

    // Optionally update the Garage's updatedAt field when a car is added
    await Garage.findByIdAndUpdate(carData.garage, { updatedAt: new Date() });

    return newCar;
}


async function getAllCars() {
    const cars = await Car.find().populate('garage', 'name');
    return cars;
}

async function getAvailableCars(startDate, endDate) {
    // Ensure startDate and endDate are valid Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Find all reservations that overlap with the given date range
    const overlappingReservations = await Reservation.find({
        startDate: { $lte: end },
        endDate: { $gte: start }
    }).select('car');

    // Extract the car IDs from these reservations
    const reservedCarIds = overlappingReservations.map(reservation => reservation.car);

    // Find all cars whose _id is not in the reservedCarIds array
    const availableCars = await Car.find({ _id: { $nin: reservedCarIds } })
        .populate('garage', 'name'); // Populate garage info as needed

    return availableCars;
}

async function getCarById(carId) {
    const car = await Car.findById(carId).populate('garage', 'name');
    return car;
}

async function updateCar(carId, updateData, user) {
    const car = await Car.findById(carId);
    if (!car) {
        throw new Error('Car not found');
    }
    // For maintainers, verify that the car's garage matches the user's garage.
    if (user.role === 'maintainer' && !car.garage.equals(user.garage)) {
        throw new Error('Unauthorized to update this car');
    }
    const updatedCar = await Car.findByIdAndUpdate(carId, updateData, { new: true });
    return updatedCar;
}

async function deleteCar(carId, user) {
    const car = await Car.findById(carId);
    if (!car) {
        throw new Error('Car not found');
    }
    // For maintainers, verify that the car belongs to their garage.
    if (user.role === 'maintainer' && !car.garage.equals(user.garage)) {
        throw new Error('Unauthorized to delete this car');
    }
    await Car.findByIdAndDelete(carId);
    return;
}

module.exports = {
    addCar,
    getAllCars,
    getAvailableCars,
    getCarById,
    updateCar,
    deleteCar
};
