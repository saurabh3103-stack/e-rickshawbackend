const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true},
    name: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    pin: { type: String, default: null },
    dob: { type: Date, default: null },
    gender : {type:String,default:null},
   
    aadhar_number: { type: String },
    aadhar_image: { type: String },
    voter_id_number: { type: String },
    voter_image: { type: String },
    driving_license_number: { type: String },
    driving_license: { type: String },
    profile_pic: { type: String },
    reference_id: { type: String, default: null },
    added_by: { type: String, default: null },      
    added_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, default: 0 },
    created_at: { type: Date, default: Date.now },  
    updated_at: { type: Date, default: Date.now },  
});

module.exports = mongoose.model('Driver', driverSchema);
