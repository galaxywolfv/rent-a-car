const express = require('express');
const router = express.Router();
const { auth, checkAdmin } = require('../middleware/auth');
const {
    createGarage,
    getAllGarages,
    getGarageById,
    updateGarage,
    deleteGarage
} = require('../services/garage.service');

// Get all garages using the service
router.get('/', async (req, res) => {
    try {
        const garages = await getAllGarages();
        res.status(200).json(garages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new garage (accessible by authenticated users)
// The creator will automatically be assigned as the maintainer
router.post('/', auth, async (req, res) => {
    try {
        // Pass the request body and the authenticated user to the service function
        const newGarage = await createGarage(req.body, req.user);
        res.status(201).json(newGarage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a single garage by ID using the service
router.get('/:id', async (req, res) => {
    try {
        const garage = await getGarageById(req.params.id);
        if (!garage) {
            return res.status(404).json({ error: 'Garage not found' });
        }
        res.status(200).json(garage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a garage using the service (only the assigned maintainer or an admin can update)
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedGarage = await updateGarage(req.params.id, req.body, req.user);
        res.status(200).json(updatedGarage);
    } catch (error) {
        if (error.message === 'Garage not found') {
            res.status(404).json({ error: error.message });
        } else if (error.message === 'Unauthorized to update this garage') {
            res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Delete a garage using the service (admin-only)
router.delete('/:id', auth, checkAdmin, async (req, res) => {
    try {
        const garage = await deleteGarage(req.params.id);
        if (!garage) {
            return res.status(404).json({ error: 'Garage not found' });
        }
        res.status(200).json({ message: 'Garage deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
