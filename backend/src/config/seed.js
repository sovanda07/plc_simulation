// pre-filling database with initial data
require('dotenv').config();
const connectDB = require("./db");
const Machine = require("../models/Machine");

const machines = [
    { machineId: "A", name: "Machine A", location: "Bay 1", status: "Running" },
    { machineId: "B", name: "Machine B", location: "Bay 2", status: "Stopped" },
    { machineId: "C", name: "Machine C", location: "Bay 3", status: "Alarm" }
];

const seed= async () => {
    await connectDB();
    await Machine.deleteMany();
    await Machine.insertMany();
    console.log("Machines seeded");
    process.exit();
}

seed();