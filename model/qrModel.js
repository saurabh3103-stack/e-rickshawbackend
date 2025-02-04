const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema({
    uniqueId: { type: String, required: true, unique: true },
    qrPath: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("QR", qrSchema);
