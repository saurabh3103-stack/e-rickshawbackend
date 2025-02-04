const express = require('express');
const bcrypt = require('bcrypt');
const Administration = require('../model/administration'); // Path to the model
const router = express.Router();

router.post('/register', async (req, res) => {
    const { administration_name, username, login_email, password } = req.body;
  
    try {
      const existingAdmin = await Administration.findOne({
        $or: [{ login_email: login_email }, { username: username }],
      });
  
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists with this email or username' });
      }  
      const newAdmin = new Administration({
        administration_name,
        username,
        login_email,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      newAdmin.password = await bcrypt.hash(password, salt);  
      const savedAdmin = await newAdmin.save();
      res.status(201).json({
        message: 'Admin registered successfully',
        adminId: savedAdmin._id, 
        username: savedAdmin.username,
        administration_name: savedAdmin.administration_name,
        login_email: savedAdmin.login_email,
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Administration.findOne({ login_email: email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({
      message: 'Login successful',
      admin: {
        id: admin._id,
        username: admin.username,
        administration_name: admin.administration_name,
        email: admin.login_email,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
