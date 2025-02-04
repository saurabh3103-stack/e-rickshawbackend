const express = require('express');
const AppUser = require('../model/appuser'); // Model import
const apiKeyAuth = require('../middleware/apiKeyAuth'); // API key middleware
const router = express.Router();

// Add new AppUser route
router.post('/add_appuser', async (req, res) => {
    const { name, email, phone, user_id, password, photo } = req.body;
    console.log(req.body);

    try {
        // Check if a user with the given email or phone already exists
        const existingUser = await AppUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already registered', status: 2 });
        }

        // Create a new user
        const newAppUser = new AppUser({ name, email, phone, user_id, password, photo });
        await newAppUser.save();
        res.status(201).json({ message: 'App User added successfully', status: 1 });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

// Get all AppUsers route
router.get('/', apiKeyAuth, async (req, res) => {
    try {
        const appUsers = await AppUser.find(); // Fetch all users
        res.status(200).json(appUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

// Get AppUser by ID
router.get('/:id', apiKeyAuth, async (req, res) => {
    const { id } = req.params;

    try {
        const user = await AppUser.findById(id); // Find user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

router.put('/:id', apiKeyAuth, async (req, res) => {
    const { id } = req.params; 
    const { name, email, phone, user_id, password, photo } = req.body;  
    
    try {
        const updatedUser = await AppUser.findByIdAndUpdate(
            id,
            { name, email, phone, user_id, password, photo },  
            { new: true, runValidators: true }  
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'App User not found', status: 0 });
        }

        res.status(200).json({ message: 'App User updated successfully', status: 1, data: updatedUser }); // Corrected `updatedRoute` to `updatedUser`
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});


// Login route (without encryption)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await AppUser.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: 0 });
        }
        if (!user.isactive) {
            return res.status(403).json({ message: 'User is not active', status: 0 });
        }
        if (password !== user.password) {
            return res.status(400).json({ message: 'Invalid credentials', status: 0 });
        }
        
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
        user.token = token;
        await user.save();
        res.json({ message: 'Login successful', status: 1 });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error, status: 0 });
    }
});

// Logout route
router.post('/logout', async (req, res) => {
    const { token } = req.body;

    try {
        const user = await AppUser.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: 0 });
        }

        user.token = null;
        await user.save();
        res.json({ message: 'Logout successful', status: 1 });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.put('/inactive/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find the user by userId and ensure their status is 0
      const app_user = await AppUser.findOne({ _id: userId});
  
      if (!app_user) {
        return res.status(404).json({ message: 'User not found or already Inactive', status: 0 });
      }
  
      // Update status to 1
      app_user.status = 0;
      await app_user.save();
  
      res.status(200).json({ message: 'Status updated successfully', status: 1 });
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ message: 'Server error', status: 0, error });
    }
  });
   router.put('/active/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find the user by userId and ensure their status is 0
      const app_user = await AppUser.findOne({ _id: userId});
  
      if (!app_user) {
        return res.status(404).json({ message: 'User not found or already active', status: 1 });
      }
  
      // Update status to 1
      app_user.status = 1;
      await app_user.save();
      res.status(200).json({ message: 'Status updated successfully', status: 1 });
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ message: 'Server error', status: 0, error });
    }
  });


module.exports = router;
