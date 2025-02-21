const express = require('express');
const { fetchVehicleMakes, fetchModelsForMakeName } = require('../services/vehicle.service');
const router = express.Router();

/**
 * @route GET /vehicles/makes
 * @desc Get vehicle makes for cars
 */
router.get('/makes', async (_, res) => {
    try {
        const makes = await fetchVehicleMakes();
        res.status(200).json(makes); // Returns an array of { name: string }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /vehicles/models/:makeName
 * @desc Get vehicle models for a specific make name
 */
router.get('/models/:makeName', async (req, res) => {
    try {
        const { makeName } = req.params;
        const models = await fetchModelsForMakeName(makeName); // Updated to use makeName
        res.status(200).json(models); // Returns an array of { name: string }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
