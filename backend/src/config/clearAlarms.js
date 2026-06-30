require("dotenv").config();
const connectDB = require("./db");
const Alarm = require("../models/Alarm");

const clear = async () => {
    await connectDB();
    const result = await Alarm.deleteMany();
    console.log(`Deleted ${result.deletedCount} alarms`);
    process.exit();
};

clear();