const Reservation = require('../models/reservation.model');
const Car = require('../models/car.model');

async function createReservation(reservationData, user) {
    const newReservation = await Reservation.create({
        user: user.id,
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
    if (user.role === 'maintainer') {
        reservations = await Reservation.find()
            .populate('user', 'username email')
            .populate('car');
    } else {
        reservations = await Reservation.find({ user: user.id }).populate('car');
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

    if (user.role !== 'maintainer' && !reservation.user._id.equals(user.id)) {
        throw new Error('Unauthorized access');
    }
    return reservation;
}

async function updateReservation(reservationId, updateData, user) {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
        throw new Error('Reservation not found');
    }
    if (user.role !== 'maintainer' && !reservation.user.equals(user.id)) {
        throw new Error('Unauthorized to update this reservation');
    }
    const updatedReservation = await Reservation.findByIdAndUpdate(reservationId, updateData, { new: true });
    // If the reservation is cancelled, update the associated car's status to "available"
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
    if (user.role !== 'maintainer' && !reservation.user.equals(user.id)) {
        throw new Error('Unauthorized to delete this reservation');
    }
    await Car.findByIdAndUpdate(reservation.car, { status: 'available' });
    await Reservation.findByIdAndDelete(reservationId);
}

async function requestReturn(reservationId, user) {    
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
        throw new Error('Reservation not found');
    }
    if (user.role !== 'maintainer' && !reservation.user.equals(user.id)) {
        throw new Error('Unauthorized to request return');
    }
    reservation.requestReturn();
    await reservation.save();
    return reservation;
}

async function approveReturn(reservationId, user, pictures) {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
        throw new Error('Reservation not found');
    }
    if (user.role !== 'maintainer') {
        throw new Error('Unauthorized to approve return');
    }
    reservation.approveReturn();
    if (pictures && Array.isArray(pictures)) {
        pictures.forEach(url => {
            reservation.pictures.push({ url });
        });
    }
    await reservation.save();
    return reservation;
}

async function rejectReturn(reservationId, user, pictures) {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
        throw new Error('Reservation not found');
    }
    if (user.role !== 'maintainer') {
        throw new Error('Unauthorized to reject return');
    }
    reservation.rejectReturn();
    if (pictures && Array.isArray(pictures)) {
        pictures.forEach(url => {
            reservation.pictures.push({ url });
        });
    }
    await reservation.save();
    return reservation;
}

module.exports = {
    createReservation,
    getReservations,
    getReservationById,
    updateReservation,
    deleteReservation,
    requestReturn,
    approveReturn,
    rejectReturn,
};
