const express = require('express');
const router = express.Router();
const {
    createReservation,
    getReservations,
    getReservationById,
    updateReservation,
    deleteReservation,
    requestReturn,
    approveReturn,
    rejectReturn
} = require('../services/reservation.service');
const { auth } = require('../middleware/auth');

/**
 * GET /reservations
 * - Maintainers get all reservations (populated with user and car details).
 * - Regular users see only their own reservations.
 */
router.get('/', auth, async (req, res) => {
    try {
        const reservations = await getReservations(req.user);
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /reservations
 * - Create a new reservation for the logged-in user.
 * - Immediately update the associated car's status to "reserved".
 */
router.post('/', auth, async (req, res) => {
    try {
        const newReservation = await createReservation(req.body, req.user);
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * GET /reservations/:id
 * - Retrieve a reservation by ID.
 * - Accessible only by the reservation owner or a maintainer.
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const reservation = await getReservationById(req.params.id, req.user);
        res.status(200).json(reservation);
    } catch (error) {
        if (error.message === 'Reservation not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(403).json({ error: error.message });
        }
    }
});

/**
 * PUT /reservations/:id
 * - Update a reservation (only allowed for the owner or a maintainer).
 * - If the reservation is cancelled, update the associated car's status to "available".
 */
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedReservation = await updateReservation(req.params.id, req.body, req.user);
        res.status(200).json(updatedReservation);
    } catch (error) {
        if (error.message === 'Reservation not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(403).json({ error: error.message });
        }
    }
});

/**
 * DELETE /reservations/:id
 * - Delete a reservation (only allowed for the owner or a maintainer).
 * - Optionally update the car's status to "available" upon deletion.
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        await deleteReservation(req.params.id, req.user);
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        if (error.message === 'Reservation not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(403).json({ error: error.message });
        }
    }
});

/**
 * POST /reservations/:id/request-return
 * - Endpoint for the user to request an early return (or to confirm return when endDate is reached).
 * - Changes reservation status from "ongoing" to "return_requested".
 */
router.post('/:id/request-return', auth, async (req, res) => {
    try {
        const reservation = await requestReturn(req.params.id, req.user);
        res.status(200).json({ message: 'Return requested successfully', reservation });
    } catch (error) {
        if (error.message === 'Reservation not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(403).json({ error: error.message });
        }
    }
});

/**
 * POST /reservations/:id/approve-return
 * - Endpoint for a maintainer to approve a return request.
 * - Accepts an array of image URLs in req.body.pictures.
 * - Pictures are attached automatically with incremented version numbers.
 * - Changes status to "return_approved".
 */
router.post('/:id/approve-return', auth, async (req, res) => {
    try {
        const reservation = await approveReturn(req.params.id, req.user, req.body.pictures);
        res.status(200).json({ message: 'Return approved successfully', reservation });
    } catch (error) {
        if (error.message === 'Reservation not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(403).json({ error: error.message });
        }
    }
});

/**
 * POST /reservations/:id/reject-return
 * - Endpoint for a maintainer to reject a return request.
 * - Accepts an array of image URLs in req.body.pictures.
 * - New pictures are appended and assigned incremented version numbers automatically.
 * - Changes status back to "ongoing".
 */
router.post('/:id/reject-return', auth, async (req, res) => {
    try {
        const reservation = await rejectReturn(req.params.id, req.user, req.body.pictures);
        res.status(200).json({ message: 'Return request rejected, status reverted to ongoing', reservation });
    } catch (error) {
        if (error.message === 'Reservation not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(403).json({ error: error.message });
        }
    }
});

module.exports = router;
