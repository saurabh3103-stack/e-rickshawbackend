const express = require("express");
const Admin = require("../model/admin"); 
const apiKeyAuth = require('../middleware/apiKeyAuth'); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/create",apiKeyAuth, async (req, res) => {
  try {
    const { admin_name, email, password, zone_name } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Email already in use" });
    const newAdmin = new Admin({ admin_name, email, password, zone_name });
    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


router.get("/", apiKeyAuth, async (req, res) => {
  try {
    const admins = await Admin.find(); 
    if (!admins || admins.length === 0) return res.status(404).json({ message: "No admins found" });

    res.json(admins); 
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.post("/login", apiKeyAuth, async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
    const token = jwt.sign({ id: admin._id }, jwtSecret, { expiresIn: "1d" });
    res.json({ message: "Login successful", token,admin });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


router.get("/:id", apiKeyAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Update Admin
router.put("/:id", apiKeyAuth, async (req, res) => {
  try {
    const { admin_name, zone_name } = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, { admin_name, zone_name }, { new: true });
    if (!updatedAdmin) return res.status(404).json({ message: "Admin not found" });

    res.json({ message: "Admin updated successfully", admin: updatedAdmin });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Update Admin Password
router.put("/update-password/:id", apiKeyAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isPasswordValid = await admin.comparePassword(oldPassword);
    if (!isPasswordValid) return res.status(400).json({ message: "Incorrect old password" });

    admin.password = newPassword;
    await admin.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Forgot Password
router.post("/forgot-password",apiKeyAuth, async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset link sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Update Admin Status
router.put("/update-status/:id", apiKeyAuth, async (req, res) => {
  try {
    const { status } = req.body; 
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    admin.status = status; 
    await admin.save();
    res.json({ message: "Admin status updated successfully", admin });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
