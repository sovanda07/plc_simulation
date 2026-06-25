const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    machineId: { type: String, require: true },
    temperature: Number,
    speed: Number,
    current: Number,
    energy: Number,
    productionCount: Number,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SensorData", sensorDataSchema);