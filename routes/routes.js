const express = require('express');
const RoutesPath = require('../model/routes');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const router = express.Router();

// Add Route
router.post('/add_routes', async (req, res) => {
    const { start_point, end_point, admin_id, start_lat, start_lng, end_lat, end_lng, distance } = req.body; // Include new fields
    console.log(req.body);
    try {
        const routesPath = new RoutesPath({ 
            start_point, 
            end_point, 
            admin_id:admin_id|| null, 
            start_lat: start_lat || null, 
            start_lng: start_lng || null, 
            end_lat: end_lat || null, 
            end_lng: end_lng || null, 
            distance: distance || null 
        });
        await routesPath.save();
        res.status(201).json({ message: 'Route added successfully', status: 1 });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

// Get All Routes
router.get('/', apiKeyAuth, async (req, res) => {
    try {
        const routes = await RoutesPath.find().populate('admin_id'); // Populate admin details
        res.status(200).json(routes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

// Get Routes by Admin ID
router.get('/admin/:admin_id', apiKeyAuth, async (req, res) => {
    const { admin_id } = req.params; // Extract admin_id from URL
    try {
        const routes = await RoutesPath.find({ admin_id }).populate('admin_id'); // Fetch routes by admin_id
        if (routes.length === 0) {
            return res.status(404).json({ message: 'No routes found for this admin', status: 0 });
        }
        res.status(200).json({ message: 'Routes fetched successfully', status: 1, data: routes });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

// Get Route by ID
router.get('/:id', apiKeyAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const route = await RoutesPath.findById(id); // Populate admin details
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }
        res.status(200).json(route);
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

// Update Route by ID
router.put('/:id', apiKeyAuth, async (req, res) => {
    const { id } = req.params;
    const { start_point, end_point, admin_id, start_lat, start_lng, end_lat, end_lng, distance } = req.body; // Include new fields
    try {
        const updatedRoute = await RoutesPath.findByIdAndUpdate(
            id,
            { 
                start_point, 
                end_point, 
                admin_id, 
                start_lat: start_lat || null, 
                start_lng: start_lng || null, 
                end_lat: end_lat || null, 
                end_lng: end_lng || null, 
                distance: distance || null 
            }, // Update fields with nullable values
            { new: true, runValidators: true }
        );
        if (!updatedRoute) {
            return res.status(404).json({ message: 'Route not found', status: 0 });
        }
        res.status(200).json({ message: 'Route updated successfully', status: 1, data: updatedRoute });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

// Mark Route as Inactive
router.put('/inactive/:ID', async (req, res) => {
    try {
        const { ID } = req.params;
        const route = await RoutesPath.findOne({ _id: ID });
        if (!route) {
            return res.status(404).json({ message: 'Route not found or already Inactive', status: 0 });
        }
        route.status = 0;
        await route.save();
        res.status(200).json({ message: 'Status updated successfully', status: 1 });
    } catch (error) {
        console.error('Error updating route status:', error);
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

// Mark Route as Active
router.put('/active/:ID', async (req, res) => {
    try {
        const { ID } = req.params;
        const route = await RoutesPath.findOne({ _id: ID });
        if (!route) {
            return res.status(404).json({ message: 'Route not found or already active', status: 0 });
        }
        route.status = 1;
        await route.save();
        res.status(200).json({ message: 'Status updated successfully', status: 1 });
    } catch (error) {
        console.error('Error updating route status:', error);
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

module.exports = router;
