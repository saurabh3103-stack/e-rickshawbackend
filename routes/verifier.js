const express = require('express');
const Verifier = require('../model/verifier');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const multer = require("multer");

// Configure multer
const upload = multer(); // Configure multer as needed

    router.post('/register',apiKeyAuth, upload.single('photo'), async (req, res) => {
        try {
            console.log("Request body:", req.body);
            console.log("File:", req.file);
            const { 
                password, name, dob, aadhaar_number, address, 
                designation, zone_id, zone_head, mobile, 
                email, added_id, added_by, police_name, police_id 
            } = req.body;
            // Define required fields
            const requiredFields = [
                'password', 'name', 'dob', 'aadhaar_number', 'address', 
                'designation', 'zone_id', 'mobile', 
                'email',
            ];
            // Validate required fields
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ message: `Field '${field}' is required` });
                }
            }
            // Check for existing user by Aadhaar number or email
            const existingUser = await Verifier.findOne({ $or: [{ aadhaar_number }, { email }] });
            if (existingUser) {
                return res.status(400).json({ message: 'User, Aadhaar number, or email already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifier = new Verifier({
                password: hashedPassword,
                name,
                dob,
                aadhaar_number,
                address,
                designation,
                zone_id: zone_id, 
                zone_head,
                mobile_number: mobile,
                email,
                photo: req.file ? req.file.buffer : null, 
                added_id,
                police_stationname:police_name,
                police_id,
                added_by,
            });

            // Save the verifier
            await verifier.save();

            // Respond with success
            res.status(201).json({ message: 'Verifier registered successfully', created_at: verifier.createdAt });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: 'Server error', error });
        }
    });

// Verifier Login
router.post('/login',apiKeyAuth, async (req, res) => {
    const { email, password } = req.body;
    try {
        const verifier = await Verifier.findOne({ email });
        if (!verifier) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, verifier.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: verifier._id, role: verifier.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get Verifiers List
router.get('/', apiKeyAuth, async (req, res) => {
    try {
        const verifiers = await Verifier.find(); // Fetch all verifiers
        if (!verifiers || verifiers.length === 0) {
            return res.status(404).json({ message: 'No verifiers found' });
        }
        res.status(200).json(verifiers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get Verifier Profile
router.get('/profile/:user_id', apiKeyAuth, async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const verifier = await Verifier.findById(user_id).populate('zone_id');
        if (!verifier) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(verifier);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.put('/update/:id', apiKeyAuth, upload.single('photo'), async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const verifier = await Verifier.findById(id);
        if (!verifier) {
            return res.status(404).json({ message: 'Verifier not found' });
        }

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        // Update fields
        Object.assign(verifier, updateData);

        // Handle photo update
        if (req.file) {
            verifier.photo = req.file.buffer;
        }

        await verifier.save();
        res.status(200).json({ message: 'Verifier updated successfully', verifier });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.delete('/delete/:id', apiKeyAuth, async (req, res) => {
    try {
        const verifier = await Verifier.findByIdAndDelete(req.params.id);
        if (!verifier) {
            return res.status(404).json({ message: 'Verifier not found' });
        }
        res.status(200).json({ message: 'Verifier deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


router.put('/update-status/:id', apiKeyAuth, async (req, res) => {
    try {
        const { status } = req.body; 
        if (!status || !['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const verifier = await Verifier.findById(req.params.id);
        if (!verifier) {
            return res.status(404).json({ message: 'Verifier not found' });
        }
        verifier.status = status;
        await verifier.save();
        res.status(200).json({ message: 'Verifier status updated successfully', verifier });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/by-admin/:admin_id', apiKeyAuth, async (req, res) => {
    try {
        const { admin_id } = req.params;

        // Validate admin_id
        if (!admin_id) {
            return res.status(400).json({ message: 'Admin ID is required' });
        }

        // Fetch verifiers for the given admin_id
        const verifiers = await Verifier.find({ admin_id }).select('-password -__v'); // Exclude sensitive fields like password and __v

        // Check if verifiers are found
        if (!verifiers || verifiers.length === 0) {
            return res.status(404).json({ message: 'No verifiers found for this admin' });
        }

        // Return the found verifiers
        res.status(200).json(verifiers);
    } catch (error) {
        console.error('Error fetching verifiers:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;
