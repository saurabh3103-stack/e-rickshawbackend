const express = require('express');
const multer = require('multer');
const VehicleDocument = require('../model/vehicledocument');
const router = express.Router();
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/assets/upload/');  
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/create', upload.fields([
    { name: 'insurance_image', maxCount: 1 },
    { name: 'fitness_image', maxCount: 1 },
    { name: 'pollution_image', maxCount: 1 },
    { name: 'ownership_image', maxCount: 1 },
    { name: 'photos', maxCount: 5 }  
]), async (req, res) => {
    try {
        const { vehicle_id, rc, insurance_date, insurance_exp_date, fitness_date, fitness_exp_date, pollution_date, pollution_exp_date } = req.body;
        const insurance_image = req.files['insurance_image'] ? req.files['insurance_image'][0].path : null;
        const fitness_image = req.files['fitness_image'] ? req.files['fitness_image'][0].path : null;
        const pollution_image = req.files['pollution_image'] ? req.files['pollution_image'][0].path : null;
        const ownership_image = req.files['ownership_image'] ? req.files['ownership_image'][0].path : null;
        const photos = req.files['photos'] ? req.files['photos'].map(file => file.path) : [];

        const vehicleDocument = new VehicleDocument({
            vehicle_id,
            rc,
            insurance_date,
            insurance_exp_date,
            insurance_image,
            fitness_date,
            fitness_exp_date,
            fitness_image,
            pollution_date,
            pollution_exp_date,
            pollution_image,
            ownership_image,
            photos,
        });

        const savedDocument = await vehicleDocument.save();
        res.status(201).json({ message: 'Vehicle document created successfully', document: savedDocument });
    } catch (error) {
        res.status(500).json({ message: 'Error creating vehicle document', error });
    }
});

module.exports = router;
