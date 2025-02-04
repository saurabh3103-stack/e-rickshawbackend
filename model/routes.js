const mongoose = require('mongoose');

const routesSchema = new mongoose.Schema({
    start_point: {
        type: String,
    },
    end_point: {
        type: String,
    },
    start_lat: {
        type: Number,
        default: null, // Allow null value
    },
    start_lng: {
        type: Number,
        default: null, // Allow null value
    },
    end_lat: {
        type: Number,
        default: null, // Allow null value
    },
    end_lng: {
        type: Number,
        default: null, // Allow null value
    },
    distance: {
        type: String,
        default: null, // Allow null value
    },
    status: {
        type: Number,
        default: 1,
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Admin collection
        ref: 'Admin',
        // required: true, // Ensure admin_id is always provided
        default:null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Routes_path = mongoose.model('Routes_path', routesSchema);
module.exports = Routes_path;
