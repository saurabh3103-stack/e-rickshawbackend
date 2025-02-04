const express = require("express");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const QR = require("../model/qrModel");

const qrCode = express.Router();

// Ensure 'qrcodes' directory exists
const qrDirectory = path.join(__dirname, "../qrcodes");
if (!fs.existsSync(qrDirectory)) {
    fs.mkdirSync(qrDirectory);
}

// Serve static files from the 'qrcodes' directory
qrCode.use("/qrcodes", express.static(qrDirectory));

// Generate QR Code and save to database
qrCode.post("/generate_qr", async (req, res) => {
    try {
        console.log(req.body);
        const { uniqueId } = req.body;

        if (!uniqueId) {
            return res.status(400).json({ message: "Unique ID is required" });
        }

        // Check if QR already exists in the database
        let existingQR = await QR.findOne({ uniqueId });
        if (existingQR) {
            return res.json({
                message: "QR Code already exists",
                qrUrl: `http://localhost:3002/qrcodes/${uniqueId}.png`
            });
        }

        // Define the path to save the QR code image
        const qrPath = path.join(qrDirectory, `${uniqueId}.png`);

        // Generate QR Code with 2160x2160px size (4K resolution)
        await QRCode.toFile(qrPath, uniqueId, {
            width: 2160,  // This will make the width 2160px, and height will be adjusted to maintain the aspect ratio
            margin: 2,    // Optional: Adds a small margin around the QR code (adjust as needed)
        });

        // Save to database
        const qrData = new QR({ uniqueId, qrPath });
        await qrData.save();

        res.json({
            message: "QR Code generated successfully",
            qrUrl: `http://localhost:3002/qrcodes/${uniqueId}.png`
        });
    } catch (error) {
        console.error("QR Code Generation Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});

// Get QR Code by uniqueId
qrCode.get("/get_qr/:uniqueId", async (req, res) => {
    try {
        const { uniqueId } = req.params;

        const qrData = await QR.findOne({ uniqueId });
        if (!qrData) {
            return res.status(404).json({ message: "QR Code not found" });
        }

        res.json({
            uniqueId: qrData.uniqueId,
            qrUrl: `http://localhost:3002/qrcodes/${qrData.uniqueId}.png`
        });
    } catch (error) {
        console.error("Error fetching QR Code:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = qrCode;
