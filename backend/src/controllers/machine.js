const Machine = require("../models/Machine");

// Get all machines
exports.getMachines = async (req, res) => {  // ← getMachines (plural)
    try {
        const machines = await Machine.find();
        res.json(machines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get one machine by id
exports.getMachine = async (req, res) => {   // ← getMachine (singular)
    try {
        const machine = await Machine.findOne({ machineId: req.params.id });
        if (!machine) return res.status(404).json({ message: "Machine not found" });
        res.json(machine);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update machine status
exports.updateMachine = async (req, res) => {
    try {
        const machine = await Machine.findOneAndUpdate(
            { machineId: req.params.id },
            { status: req.body.status },
            { new: true }
        );
        res.json(machine);  // ← res not req
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};