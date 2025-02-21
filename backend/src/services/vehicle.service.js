const axios = require('axios');

const { VEHICLE_URL } = process.env;

/**
 * Fetch vehicle makes for a given vehicle type (sorted alphabetically by name).
 * @param {string} vehicleType - The type of vehicle (default is 'car').
 * @returns {Promise<{name: string}[]>} Sorted list of makes.
 */
async function fetchVehicleMakes(vehicleType = 'car') {
    try {
        const response = await axios.get(`${VEHICLE_URL}/GetMakesForVehicleType/${vehicleType}?format=json`);
        return response.data.Results
            .map((make) => ({
                name: make.MakeName, // Only retrieve name
            }))
            .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name (A-Z)
    } catch (error) {
        throw new Error(`Failed to fetch vehicle makes: ${error.message}`);
    }
}

/**
 * Fetch models for a given make name (sorted alphabetically by name).
 * @param {string} makeName - The make name.
 * @returns {Promise<{name: string}[]>} Sorted list of models.
 */
async function fetchModelsForMakeName(makeName) {
    try {
        const response = await axios.get(`${VEHICLE_URL}/GetModelsForMake/${makeName}?format=json`);
        return response.data.Results
            .map((model) => ({
                name: model.Model_Name, // Only retrieve name
            }))
            .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name (A-Z)
    } catch (error) {
        throw new Error(`Failed to fetch vehicle models: ${error.message}`);
    }
}

module.exports = {
    fetchVehicleMakes,
    fetchModelsForMakeName,
};
