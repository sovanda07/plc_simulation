const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
    machineId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ["Running", "Stopped", "Alarm"], default: "Stopped" }
}, { timestamps: true });

module.exports = mongoose.model("Machine", machineSchema);