const express = require('express');
const Vehicle = require('../model/vehicle');
const router = express.Router();
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Create Vehicle
router.post('/create',apiKeyAuth, async (req, res) => {
    try {
        const { owner_id, vehicle_type, vehicle_purchase_date, make, model, year_of_manufacture, color, registration_number,added_id,added_by,reference_id } = req.body;
        const vehicle = new Vehicle({
            owner_id,
            vehicle_type,
            vehicle_purchase_date,
            make,
            model,
            year_of_manufacture,
            color,
            registration_number,
            added_id,
            added_by,
            reference_id
        });
        const savedVehicle = await vehicle.save();
        res.status(201).json({ message: 'Vehicle created successfully', vehicle: savedVehicle });
    } catch (error) {
        res.status(500).json({ message: 'Error creating vehicle', error });
    }
});

module.exports = router;
