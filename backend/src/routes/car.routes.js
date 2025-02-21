const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    addCar,
    getAllCars,
    getAvailableCars,
    getCarById,
    updateCar,
    deleteCar
} = require('../services/car.service');

// Get all cars
router.get('/', async (req, res) => {
    try {
        const cars = await getAllCars();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all available cars for a given date (defaults to today)
router.get('/available', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate) {
            return res.status(400).json({

                error: 'startDate in query parameters is required.'
            });
        }

        // If no endDate is provided, default it to startDate.
        const effectiveEndDate = endDate || startDate;

        const availableCars = await getAvailableCars(startDate, effectiveEndDate);
        res.status(200).json(availableCars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new car (accessible by authenticated users)
// Maintainers can only add cars to their own garage.
router.post('/', auth, async (req, res) => {
    try {
        const newCar = await addCar(req.body, req.user);
        res.status(201).json(newCar);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a single car by ID
router.get('/:id', async (req, res) => {
    try {
        const car = await getCarById(req.params.id);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a car (only admin or the maintainer of the car's garage can update)
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedCar = await updateCar(req.params.id, req.body, req.user);
        res.status(200).json(updatedCar);
    } catch (error) {
        if (error.message === 'Car not found') {
            res.status(404).json({ error: error.message });
        } else if (error.message.startsWith('Unauthorized')) {
            res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Delete a car (only admin or the maintainer of the car's garage can delete)
router.delete('/:id', auth, async (req, res) => {
    try {
        await deleteCar(req.params.id, req.user);
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        if (error.message === 'Car not found') {
            res.status(404).json({ error: error.message });
        } else if (error.message.startsWith('Unauthorized')) {
            res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;
