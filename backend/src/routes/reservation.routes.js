const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation.model');
const { auth } = require('../middleware/auth');

// Get all reservations
// Admins can see all reservations; others see only their own
router.get('/', auth, async (req, res) => {
    try {
        let reservations;
        if (req.user.role === 'admin') {
            reservations = await Reservation.find().populate('user', 'username email').populate('car');
        } else {
            reservations = await Reservation.find({ user: req.user._id }).populate('car');
        }
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({  error: error.message });
    }
});

// Create a new reservation (logged in user)
router.post('/', auth, async (req, res) => {
    try {
        const newReservation = await Reservation.create({
            user: req.user._id,
            car: req.body.car,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        });
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(400).json({  error: error.message });
    }
});

// Get a reservation by ID (accessible only by the reservation owner or admin)
router.get('/:id', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate('car').populate('user', 'username email');
        if (!reservation) return res.status(404).json({  error: 'Reservation not found' });
        if (req.user.role !== 'admin' && !reservation.user._id.equals(req.user._id)) {
            return res.status(403).json({  error: 'Unauthorized access' });
        }
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({  error: error.message });
    }
});

// Update a reservation (only allowed for the owner or an admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({  error: 'Reservation not found' });
        if (req.user.role !== 'admin' && !reservation.user.equals(req.user._id)) {
            return res.status(403).json({  error: 'Unauthorized to update this reservation' });
        }
        const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({  error: error.message });
    }
});

// Delete a reservation (only allowed for the owner or an admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({  error: 'Reservation not found' });
        if (req.user.role !== 'admin' && !reservation.user.equals(req.user._id)) {
            return res.status(403).json({  error: 'Unauthorized to delete this reservation' });
        }
        await Reservation.findByIdAndDelete(req.params.id);
        res.status(200).json({  message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({  error: error.message });
    }
});

module.exports = router;
