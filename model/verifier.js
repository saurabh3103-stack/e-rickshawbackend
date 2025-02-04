const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VerifierSchema = new Schema({
    name: {
        type: String,
        default: null
    },
    dob: {
        type: Date,
        default: null
    },
    aadhaar_number: {
        type: String,
        default: null,
    },
    address: {
        type: String,
        default: null
    },
    designation: {
        type: String,
        default: null
    },
    zone_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    zone_head:{
        type:String,
        default:null
    },
    mobile_number: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['admin', 'verifier', 'user'], 
        default: 'verifier'
    },
    status:{
        type:String,
        default : "active"
    },
    police_stationname: {
        type: String,
        default:null
    },
    police_id: {
        type: String,
        default:null
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
    photo: {
        type:String,
        default:null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Verifier', VerifierSchema);
