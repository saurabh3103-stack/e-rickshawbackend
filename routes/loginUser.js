const express = require('express');
const router = express.Router();  // Initialize the router
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Function to generate a 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Route to generate and send OTP
router.post('/send-otp', (req, res) => {
    const { phoneNumber } = req.body;

    // Validate input
    if (!phoneNumber) {
        return res.status(400).json({
            success: false,
            message: 'Phone number is required'
        });
    }

    // Generate OTP
    const otp = generateOTP();

    // Simulate sending OTP (replace with actual SMS gateway logic in production)
    console.log(`Sending OTP ${otp} to phone number ${phoneNumber}`);

    // Respond with OTP (demo purpose only, don't do this in production)
    res.status(200).json({
        success: true,
        message: 'OTP generated successfully',
        otp
    });
});

module.exports = router;  // Export the router
