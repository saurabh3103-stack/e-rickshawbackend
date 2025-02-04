const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../model/user');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const router = express.Router();


const uploadedFolder = path.join(__dirname, '../src/assets/upload'); // Corrected path
if (!fs.existsSync(uploadedFolder)) {
    fs.mkdirSync(uploadedFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadedFolder); // Save to the correct upload folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

router.post('/add_user', upload.fields([
  { name: 'owner_photo', maxCount: 1 },
  { name: 'addhar_image', maxCount: 1 },
  { name: 'owner_dl_image', maxCount: 1 },
  { name: 'rickshaw_photo', maxCount: 1 },
  { name: 'd_addhar_image', maxCount: 1 },
  { name: 'd_photo', maxCount: 1 },
  { name: 'driver_dl_image', maxCount: 1 }
]), async (req, res) => {
  try {
      console.log('Request Body:', req.body);
      console.log('Files:', req.files);
      const {
          owner_name, email, phone_owner, addhar_number, owner_dl,
          e_rickshaw, chassis, fitness, address_line_f, address_line_t,
          city, state, pin_code, driver_name, d_phone, d_addhar_number,
          d_dl_number, d_address_line_f, d_address_line_t,
          d_city, d_state, d_pin_code, e_ricksaw_route,
          admin_id, admin_type // Extract admin_id and admin_type from the request body
      } = req.body;

      // Check if the e_rickshaw already exists
      const existingUser = await User.findOne({ e_rickshaw });
      if (existingUser) {
          return res.status(400).json({ message: 'User already registered', status: 2 });
      }
      // Create a new user instance with the provided and uploaded data
      const user = new User({
          owner_name,
          email,
          phone_owner,
          addhar_number,
          owner_dl,
          e_rickshaw,
          chassis,
          fitness,
          address_line_f,
          address_line_t,
          city,
          state,
          pin_code,
          driver_name,
          d_phone,
          d_addhar_number,
          d_dl_number,
          d_address_line_f,
          d_address_line_t,
          d_city,
          d_state,
          d_pin_code,
          e_ricksaw_route,
          admin_id, // Add admin_id
          admin_type, // Add admin_type
          // Assign uploaded file paths to user fields
          owner_photo: req.files['owner_photo'] ? req.files['owner_photo'][0].filename : '',
          addhar_image: req.files['addhar_image'] ? req.files['addhar_image'][0].filename : '',
          owner_dl_image: req.files['owner_dl_image'] ? req.files['owner_dl_image'][0].filename : '',
          rickshaw_photo: req.files['rickshaw_photo'] ? req.files['rickshaw_photo'][0].filename : '',
          d_addhar_image: req.files['d_addhar_image'] ? req.files['d_addhar_image'][0].filename : '',
          d_photo: req.files['d_photo'] ? req.files['d_photo'][0].filename : '',
          driver_dl_image: req.files['driver_dl_image'] ? req.files['driver_dl_image'][0].filename : ''
      });

      // Save the user to the database
      const savedUser = await user.save();

      res.status(201).json({
          message: 'User added successfully',
          status: 1,
          userId: savedUser._id // Return the last inserted ID
      });

  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
          message: 'Server error',
          status: 0,
          error
      });
  }
});


// Get All Users
router.get('/', apiKeyAuth, async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});

// Get User by ID
router.get('/:id', apiKeyAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id); // Find user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 0, error });
    }
});


router.get('/user/:userId/:status', async (req, res) => {
    try {
      const { userId, status } = req.params;
      const user = await User.findOne({ _id: userId, status: 0 });
      console.log(user);
      if (!user) {
        return res.status(404).json({ message: 'User not found or status does not match', status: 0 });
      }
      res.status(200).json({ message: 'User found', status: 1, user });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Server error', status: 0, error });
    }
  });



router.put('/update-status/:id', apiKeyAuth, async (req, res) => {
    try {
        const { status } = req.body;
        
console.log(status)
        // Validate status
        if (!status || !['active', 'inactive'].includes(status.toLowerCase())) {

            return res.status(400).json({ message: 'Invalid status' });
        }

        // Find zone by ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Zone not found' });
        }

        // Update status
        user.status = status.toLowerCase();
        await user.save();

        res.status(200).json({ message: 'Zone status updated successfully', data: user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update data by user id
  // router.put('/update_status/:userId', async (req, res) => {
  //   try {
  //     const { userId } = req.params;
  
  //     // Find the user by userId and ensure their status is 0
  //     const user = await User.findOne({ _id: userId, status: 0 });
  
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found or already active', status: 0 });
  //     }
  
  //     // Update status to 1
  //     user.status = 1;
  //     await user.save();
  
  //     res.status(200).json({ message: 'Status updated successfully', status: 1 });
  //   } catch (error) {
  //     console.error('Error updating user status:', error);
  //     res.status(500).json({ message: 'Server error', status: 0, error });
  //   }
  // });
  // router.put('/inactive/:userId', async (req, res) => {
  //   try {
  //     const { userId } = req.params;
  
  //     // Find the user by userId and ensure their status is 0
  //     const user = await User.findOne({ _id: userId});
  
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found or already Inactive', status: 0 });
  //     }
  
  //     // Update status to 1
  //     user.status = 0;
  //     await user.save();
  
  //     res.status(200).json({ message: 'Status updated successfully', status: 1 });
  //   } catch (error) {
  //     console.error('Error updating user status:', error);
  //     res.status(500).json({ message: 'Server error', status: 0, error });
  //   }
  // });
  //  router.put('/active/:userId', async (req, res) => {
  //   try {
  //     const { userId } = req.params;
  
  //     // Find the user by userId and ensure their status is 0
  //     const user = await User.findOne({ _id: userId});
  
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found or already active', status: 1 });
  //     }
  
  //     // Update status to 1
  //     user.status = 1;
  //     await user.save();
  //     res.status(200).json({ message: 'Status updated successfully', status: 1 });
  //   } catch (error) {
  //     console.error('Error updating user status:', error);
  //     res.status(500).json({ message: 'Server error', status: 0, error });
  //   }
  // });
  router.put('/assign_route/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(req.body)
      const {qr_assing_statu,e_ricksaw_route,qrID}=req.body
      // Find the user by userId and ensure their status is 0
      const user = await User.findOne({ _id: userId});
      if (!user) {
        return res.status(404).json({ message: 'User not found or already active', status: 1 });
      }
      // Update status to 1
      // await user.save();
      else{
        User.findByIdAndUpdate(userId,{qr_assing_statu,e_ricksaw_route,qrID}).then(()=>{
          res.status(200).json({ message: 'Status updated successfully', status: 1 });
        })
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ message: 'Server error', status: 0, error });
    }
  });

  router.get('/count', async (req, res) => {
    try {
      const userCount = await User.countDocuments({});
      res.json({ totalUsers: userCount });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
    
module.exports = router;
