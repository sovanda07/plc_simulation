const Machine = require("../models/Machine");
const SensorData = require("../models/SensorData");

// Get machine history by id
exports.getHistorical = async (req, res) => {
    try {
        const data = await SensorData.find({ machineId: req.params.machineId }).sort({ timestamp: -1 }).limit(60);
        
        // Oldest first for graphs
        res.json(data.reverse()); 
    } catch (err) {
        
    }
}