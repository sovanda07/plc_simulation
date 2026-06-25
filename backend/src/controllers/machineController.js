const Machine = require("./models/Machine");

// Get all machines
exports.getMachine = async (req, res) => {
    try {
        const machines = await Machine.find();
        res.json(machines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Get machine by id
exports.getMachine = async (req, res) => {
    try {
        const machine = await Machine.findOne({ machineId: req.params.id });
        if (!machine) return res.status(404).json({ message: "Machine is not found" });
        res.json(machine);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
}

// Update machine 
exports.updateMachine = async (req, res) => {
    try {
        const machine = await Machine.findOneAndUpdate(
            { machineId: req.params.id },
            { status: req.body.status},
            { new: true }
        );
        req.json(machine);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}