const express = require('express');
const Zone = require('../model/zone');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const router = express.Router();

router.post('/add_zone', async (req, res) => {
    const { zone_id, zone_name, zone_region } = req.body;

    try {
        const zone = new Zone({ zone_id, zone_name, zone_region });
        await zone.save();
        res.status(201).json({ message: 'Zone added successfully', status: 1 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

router.get('/', apiKeyAuth, async (req, res) => {
    try {
        const zones = await Zone.find();
        res.status(200).json(zones);
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

router.get('/:id', apiKeyAuth, async (req, res) => {
    const { id } = req.params;

    try {
        const zone = await Zone.findById(id);
        if (!zone) {
            return res.status(404).json({ message: 'Zone not found', status: 0 });
        }
        res.status(200).json(zone);
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});


router.put('/:id', apiKeyAuth, async (req, res) => {
    const { id } = req.params;
    const { zone_id, zone_name, zone_region } = req.body;

    try {
        const updatedZone = await Zone.findByIdAndUpdate(
            id,
            { zone_id, zone_name, zone_region },
            { new: true, runValidators: true }
        );
        if (!updatedZone) {
            return res.status(404).json({ message: 'Zone not found', status: 0 });
        }
        res.status(200).json({ message: 'Zone updated successfully', status: 1, data: updatedZone });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

router.put('/update-status/:id', apiKeyAuth, async (req, res) => {
    try {
        const { status } = req.body;
        
console.log(status)
        // Validate status
        if (!status || !['active', 'inactive'].includes(status.toLowerCase())) {

            return res.status(400).json({ message: 'Invalid status' });
        }

        // Find zone by ID
        const zone = await Zone.findById(req.params.id);
        if (!zone) {
            return res.status(404).json({ message: 'Zone not found' });
        }

        // Update status
        zone.status = status.toLowerCase();
        await zone.save();

        res.status(200).json({ message: 'Zone status updated successfully', data: zone });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


router.put('/inactive/:id', apiKeyAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const zone = await Zone.findById(id);
        if (!zone) {
            return res.status(404).json({ message: 'Zone not found', status: 0 });
        }

        zone.status = 0; 
        await zone.save();

        res.status(200).json({ message: 'Zone set to inactive', status: 1 });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

router.put('/active/:id', apiKeyAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const zone = await Zone.findById(id);
        if (!zone) {
            return res.status(404).json({ message: 'Zone not found', status: 0 });
        }

        zone.status = 1; 
        await zone.save();

        res.status(200).json({ message: 'Zone set to active', status: 1 });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});




router.delete('/:id', apiKeyAuth, async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the zone by ID
        const zone = await Zone.findByIdAndDelete(id);
        if (!zone) {
            return res.status(404).json({ message: 'Zone not found', status: 0 });
        }

        res.status(200).json({ message: 'Zone deleted successfully', status: 1 });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});





module.exports = router;
