const express = require("express");
const router = express.Router();
const { getHistorical } = require("../controllers/historical");

router.get("/:machineId", getHistorical);

module.exports = router;