const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
    machineId: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    location: { type: String, require: true },
    status: { type: String, enum: ["Running", "Stopped", "Alarm"], default: "Stopped" }
}); { timestamps: true };

module.exports = mongoose.model("Machine", machineSchema);