const express = require("express");
const Vehicle = require("../model/user"); 
const Routes_path = require("../model/routes"); 
const apiKeyAuth = require('../middleware/apiKeyAuth'); 
const router = express.Router();


router.get("/get_vehicle/:qrId",apiKeyAuth, async (req, res) => {
    try {
        const { qrId } = req.params;
        const vehicle = await Vehicle.findOne({ qrID: qrId });        
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        const assignedRoute = await Routes_path.findOne({ _id: vehicle.e_ricksaw_route });
        res.json({
            vehicleDetails: vehicle,
            assignedRoute: assignedRoute ? {
                start_point: assignedRoute.start_point,
                end_point: assignedRoute.end_point,
                distance: assignedRoute.distance
            } : null,
        });

    } catch (error) {
        console.error("Error fetching vehicle details:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;
