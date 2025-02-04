const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    owner_id: { type: mongoose.Schema.Types.ObjectId,  required: true },
    vehicle_type: { type: String, default : null },
    vehicle_purchase_date : { type: String, default : null},
    make: { type: String, default : null },
    model: { type: String, default : null },
    year_of_manufacture: { type: Number, default : null },
    color: { type: String, default : null },
    registration_number: { type: String, default : null },
    vehicle_route: { type: String, default: null },
    qr_assing_status: { type: Number, default: 0},
    qrID: { type: String, default: null},
    reference_id: { type: String, default: null },
    added_by: { type: String, default: null },      
    added_id: { type: mongoose.Schema.Types.ObjectId,  required: true},
    status: { type: String, default: 0 },
    created_at: { type: Date, default: Date.now },  
    updated_at: { type: Date, default: Date.now },  
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
