const Alarm = require("./models/Alarm");

// Get alarms
exports.getAlarms = async (req, res) => {
    try {
        const alarms = await Alarm.find().sort({ timestamp: -1 });
        res.json(alarms);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};

// Update acknowledge
exports.acknowledgeAlarm = async (req, res) => {
    try {
        const alarm = await Alarm.findAndUpdate(
            req.params.id,
            { acknowledge: true},
            { new: true }
        );
        res.json(alarm);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};