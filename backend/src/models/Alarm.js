const mongoose = require('mongoose');

const alarmSchema = new mongoose.Schema({
    machineId: { type: String, require: true },
    message: { type: String, require: true },
    severity: { type: String, enum: ["Critical", "Warning", "Info"], default: "Info" },
    acknowledge: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now}
});

module.exports = mongoose.model("Alarm", alarmSchema);