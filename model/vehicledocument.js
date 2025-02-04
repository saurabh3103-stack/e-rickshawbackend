const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }, // Link to the Vehicle table
    rc: { type: String },
    insurance_date: { type: String },
    insurance_exp_date: { type: String },
    insurance_image: { type: String },
    fitness_date: { type: String },
    fitness_exp_date: { type: String },
    fitness_image: { type: String },
    pollution_date: { type: String },
    pollution_exp_date: { type: String },
    pollution_image: { type: String },
    ownership_image: { type: String },
    photos: [String], // E-Rickshaw photos (side, front, back)
});

module.exports = mongoose.model('VehicleDocument', documentSchema);
