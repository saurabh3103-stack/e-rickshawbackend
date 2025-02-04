const express = require('express');
const multer = require('multer');
const path = require('path');
const Driver = require('../model/driver');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../src/assets/upload'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

router.post(
    '/create',
    apiKeyAuth,
    upload.fields([
        { name: 'aadhar_image', maxCount: 1 },
        { name: 'voter_image', maxCount: 1 },
        { name: 'driving_license', maxCount: 1 },
        { name: 'profile_pic', maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const { files, body } = req;
            console.log(body)

            // Construct driver data from request body and files
            const driverData = {
                owner_id: body.owner_id,
                name: body.name || null,
                email: body.email || null,
                phone: body.phone || null,
                address: body.address || null,
                city: body.city || null,
                state: body.state || null,
                pin: body.pin || null,
                dob: body.dob || null,
                gender: body.gender || null,
                aadhar_number: body.aadhar_number || null,
                aadhar_image: files.aadhar_image ? files.aadhar_image[0].path : null,
                voter_id_number: body.voter_id_number || null,
                voter_image: files.voter_image ? files.voter_image[0].path : null,
                driving_license_number: body.driving_license_number || null,
                driving_license: files.driving_license ? files.driving_license[0].path : null,
                profile_pic: files.profile_pic ? files.profile_pic[0].path : null,
                reference_id: body.reference_id || null,
                added_by: body.added_by || null,
                added_id: body.added_id || null,
                status: '0', // Default status
                created_at: new Date(),
                updated_at: new Date()
            };

            // Save the driver to the database
            const driver = new Driver(driverData);
            const savedDriver = await driver.save();

            res.status(201).json({ message: 'Driver created successfully', driver: savedDriver });
        } catch (error) {
            res.status(500).json({ message: 'Error creating driver', error });
        }
    }
);

module.exports = router;
