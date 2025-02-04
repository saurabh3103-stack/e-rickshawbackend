const express = require("express");
const SubAdmin = require("../model/subAdmin");
const apiKeyAuth = require("../middleware/apiKeyAuth");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create Sub-admin
router.post("/create", apiKeyAuth, async (req, res) => {
  try {
    const { subadmin_name, email, password, admin_id } = req.body;

    const existingSubAdmin = await SubAdmin.findOne({ email });
    if (existingSubAdmin) return res.status(400).json({ message: "Email already in use" });

    const newSubAdmin = new SubAdmin({ subadmin_name, email, password, admin_id });
    await newSubAdmin.save();

    res.status(201).json({ message: "Sub-admin created successfully", subAdmin: newSubAdmin });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Get all sub-admins by adminId
router.get("/by-admin/:adminId", apiKeyAuth, async (req, res) => {
  try {
    const subAdmins = await SubAdmin.find({ admin_id: req.params.adminId });
    if (!subAdmins || subAdmins.length === 0)
      return res.status(404).json({ message: "No sub-admins found for this admin" });

    res.json(subAdmins);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Get sub-admin by ID
router.get("/:id", apiKeyAuth, async (req, res) => {
  try {
    const subAdmin = await SubAdmin.findById(req.params.id);
    if (!subAdmin) return res.status(404).json({ message: "Sub-admin not found" });

    res.json(subAdmin);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Update sub-admin data by ID
router.put("/:id", apiKeyAuth, async (req, res) => {
  try {
    const { subadmin_name, email, password, admin_id } = req.body;

    const updatedSubAdmin = await SubAdmin.findByIdAndUpdate(
      req.params.id,
      { subadmin_name, email, password, admin_id },
      { new: true }
    );
    if (!updatedSubAdmin) return res.status(404).json({ message: "Sub-admin not found" });

    res.json({ message: "Sub-admin updated successfully", subAdmin: updatedSubAdmin });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Update sub-admin status by ID
router.put("/:id/status", apiKeyAuth, async (req, res) => {
  try {
    const { status } = req.body; // Assuming status is a boolean or a string like 'active'/'inactive'

    const updatedSubAdmin = await SubAdmin.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedSubAdmin) return res.status(404).json({ message: "Sub-admin not found" });

    res.json({ message: "Sub-admin status updated successfully", subAdmin: updatedSubAdmin });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Delete sub-admin by ID
router.delete("/:id", apiKeyAuth, async (req, res) => {
  try {
    const deletedSubAdmin = await SubAdmin.findByIdAndDelete(req.params.id);
    if (!deletedSubAdmin) return res.status(404).json({ message: "Sub-admin not found" });

    res.json({ message: "Sub-admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const subAdmin = await SubAdmin.findOne({ email });
    if (!subAdmin) {
      return res.status(404).json({ message: "Sub-admin not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, subAdmin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
    const token = jwt.sign({ id: subAdmin._id }, jwtSecret, { expiresIn: "1d" });
    res.json({
      message: "Login successful",
      token,
      subAdmin: {
        id: subAdmin._id,
        subadmin_name: subAdmin.subadmin_name,
        email: subAdmin.email,
        admin_id: subAdmin.admin_id,
        status: subAdmin.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});
router.get("/", apiKeyAuth, async (req, res) => {
  try {
    const subAdmins = await SubAdmin.find();
    if (!subAdmins || subAdmins.length === 0) {
      return res.status(404).json({ message: "No sub-admins found" });
    }
    res.json(subAdmins);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});
module.exports = router;
