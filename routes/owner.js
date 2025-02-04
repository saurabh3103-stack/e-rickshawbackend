const express = require('express');
const multer = require('multer');
const path = require('path');
const Owner = require('../model/owner'); // Ensure this model is properly set up
const apiKeyAuth = require('../middleware/apiKeyAuth'); // Ensure this middleware is correct
const owner = require('../model/owner');
const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/assets/upload'); // Adjust the destination path as needed
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Configure multer upload
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error(`File type not allowed: ${file.originalname}`));
        }
    }
});

// Define expected fields for multer
const uploadFields = upload.fields([
    { name: 'aadhar_image', maxCount: 1 },
    { name: 'voter_image', maxCount: 1 },
    { name: 'driving_license', maxCount: 1 },
    { name: 'profile_pic', maxCount: 1 }
]);

// Create owner API
router.post('/create', apiKeyAuth, (req, res, next) => {
    uploadFields(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Multer error', error: err.message });
        } else if (err) {
            return res.status(400).json({ message: 'File upload error', error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        const ownerData = { ...req.body };

        // Attach file paths to the owner data
        if (req.files) {
            if (req.files.aadhar_image) ownerData.aadhar_image = req.files.aadhar_image[0].path;
            if (req.files.voter_image) ownerData.voter_image = req.files.voter_image[0].path;
            if (req.files.driving_license) ownerData.driving_license = req.files.driving_license[0].path;
            if (req.files.profile_pic) ownerData.profile_pic = req.files.profile_pic[0].path;
        }

        // Generate reference ID
        const currentDate = new Date();
        const date = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const formattedDate = `${date}${month}${year}`;
        const formattedTime = `${hours}${minutes}${seconds}`;
        const referenceId = `KNPERICK${formattedDate}${formattedTime}`;
        ownerData.reference_id = referenceId;

        // Create owner
        const owner = new Owner(ownerData);
        const savedOwner = await owner.save();

        res.status(201).json({
            message: 'Owner created successfully',
            owner: savedOwner,
            reference_id: savedOwner.reference_id
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating owner', error });
    }
});

module.exports = router;
