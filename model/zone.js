const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
    zone_id: { type: String, required: true},
    zone_name: { type: String, required: true },
    zone_region: { type: String },
    status:{
        type:String,
        default : "active"
    },
}, { timestamps: true });

module.exports = mongoose.model('Zone', zoneSchema);
