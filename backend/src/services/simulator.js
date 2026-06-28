const Machine = require("../models/Machine");
const SensorData = require("../models/SensorData");
const Alarm = require("../models/Alarm");

// Helper functions
const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

// Current live values (in memory)
let state = {
    A: { temperature: 72, speed: 120, current: 4.2, energy: 3.8, productionCount: 450 },
    B: { temperature: 25, speed: 0, current: 0, energy: 0, productionCount: 312 },
    C: { temperature: 95, speed: 85, current: 6.1, energy: 5.1, productionCount: 201 },
};

const simulate = async (io) => {
    const machines = await Machine.find();

    setInterval(async () => {
        for (const machine of machines) {
            const id = machine.machineId;

            // Update values based on status
            if (machine.status === "Running") {
                state[id].temperature = clamp(state[id].temperature + rand(-1.5, 1.5), 65, 85);
                state[id].speed = clamp(state[id].speed + rand(-3, 3), 100, 140);
                state[id].current = clamp(state[id].current + rand(-0.2, 0.2), 3.5, 5.5);
                state[id].energy = clamp(state[id].energy + rand(-0.05, 0.05), 3.0, 4.5);
                state[id].productionCount += Math.random() > 0.6 ? 1 : 0;
            }

            if (machine.status === "Alarm") {
                state[id].temperature = clamp(state[id].temperature + rand(-0.5, 1.2), 85, 105);

                // Auto generate alarm if temperature is critical
                if (state[id].temperature > 100) {
                    const alarm = await Alarm.create({
                        machineId: id,
                        message: "Critical Overheat",
                        severity: "Critical",
                    });

                    // Send alarm to frontend via Socket.io
                    io.emit("new_alarm", alarm);
                }
            }

            // Save sensor reading to MongoDB
            await SensorData.create({
                machineId: id,
                ...state[id],
            });

            // Send live data to frontend via Socket.io
            io.emit("sensor_update", {
                machineId: id,
                status: machine.status,
                ...state[id],
            });
        }
    }, 1000);
};

module.exports = simulate;