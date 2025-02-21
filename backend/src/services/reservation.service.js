const Reservation = require('../models/reservation.model');
const Car = require('../models/car.model');

async function createReservation(reservationData, user) {
    // Create a reservation with the current user's ID
    const newReservation = await Reservation.create({
        user: user._id,
        car: reservationData.car,
        startDate: reservationData.startDate,
        endDate: reservationData.endDate,
    });

    // Immediately update the associated car's status to "reserved"
    await Car.findByIdAndUpdate(reservationData.car, { status: 'reserved' });

    return newReservation;
}

async function getReservations(user) {
    let reservations;
    if (user.role === 'admin') {
        reservations = await Reservation.find()
            .populate('user', 'username email')
            .populate('car');
    } else {
        reservations = await Reservation.find({ user: user._id }).populate('car');
    }
    return reservations;
}

async function getReservationById(reservationId, user) {
    const reservation = await Reservation.findById(reservationId)
        .populate('user', 'username email')
        .populate('car');
    if (!reservation) {
        throw new Error('Reservation not found');
    }
    // Non-admins can only access their own reservations
    if (user.role !== 'admin' && !reservation.user._id.equals(user._id)) {
        throw new Error('Unauthorized to view this reservation');
    }
    return reservation;
}

async function updateReservation(reservationId, updateData, user) {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
        throw new Error('Reservation not found');
    }
    if (user.role !== 'admin' && !reservation.user.equals(user._id)) {
        throw new Error('Unauthorized to update this reservation');
    }
    const updatedReservation = await Reservation.findByIdAndUpdate(reservationId, updateData, { new: true });

    // Optionally, if the reservation status changes to cancelled, update the car's status to "available"
    if (updateData.status && updateData.status === 'cancelled') {
        await Car.findByIdAndUpdate(reservation.car, { status: 'available' });
    }

    return updatedReservation;
}

async function deleteReservation(reservationId, user) {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
        throw new Error('Reservation not found');
    }
    if (user.role !== 'admin' && !reservation.user.equals(user._id)) {
        throw new Error('Unauthorized to delete this reservation');
    }
    // Optionally, update the car status to "available" when a reservation is deleted
    await Car.findByIdAndUpdate(reservation.car, { status: 'available' });
    await Reservation.findByIdAndDelete(reservationId);
    return;
}

module.exports = {
    createReservation,
    getReservations,
    getReservationById,
    updateReservation,
    deleteReservation
};
