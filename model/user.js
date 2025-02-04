const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    owner_name: {
        type: String,
       
    },
    email: {
        type: String,
    },
    phone_owner: {
        type: String,
       
    },
    owner_photo: {
        type: String,
       
    },
    addhar_number: {
        type: String,
       
    },
    addhar_image: {
        type: String 
    },
    owner_dl: {
        type: String // Driver's license number
    },
    owner_dl_image: {
        type: String // URL or path to the uploaded driver's license
    },
    e_rickshaw: {
        type: String, // Registration number of the E-Rickshaw
       
    },
    chassis: {
        type: String, // Chassis number of the vehicle
       
    },
    fitness: {
        type: String,
        default: null
    },
    rickshaw_photo: {
        type: String, // Photo of the E-Rickshaw
       
    },
    address_line_f: {
        type: String,
       
    },
    address_line_t: {
        type: String
    },
    city: {
        type: String,
       
    },
    state: {
        type: String,
       
    },
    pin_code: {
        type: String,
       
    },
    driver_name: {
        type: String,
       
    },
    d_phone: {
        type: Number,
       
    },
    d_addhar_number: {
        type: String, 
       
    },
    d_addhar_image: {
        type: String, // URL or path to the driver's Aadhar card photo
       
    },
    d_photo: {
        type: String, // URL or path to the uploaded driver's photo
       
    },
    d_dl_number: {
        type: String, // Driver's license number
       
    },
    driver_dl_image: {
        type: String, // URL or path to the uploaded driver's license
       
    },
    d_address_line_f: {
        type: String,
       
    },
    d_address_line_t: {
        type: String
    },
    d_city: {
        type: String,
       
    },
    d_state: {
        type: String,
       
    },
    d_pin_code: {
        type: String,
       
    },
    e_ricksaw_route: {
        type: String 
    },
    qr_assing_statu: {
        type: Number,
        default: 0
    },
    qrID: {
        type: String,
        default: null
    },
    status:{
        type:String,
        default : "0"
    },
    added_id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Admin', 
           default: null
       },
       added_by: {
           type: String, 
           default: null
       },
    createdAt: {
        type: Date,
        default: Date.now // Automatically sets current date
    }
});

const User = mongoose.model('test_users', userSchema);
module.exports = User;
