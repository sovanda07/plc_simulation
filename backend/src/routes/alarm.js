const express = require('express');
const router = express.Router();
const { getAlarms, acknowledgeAlarm } = require("../controllers/alarm");

router.get("/", getAlarms);
router.patch("/:id/achknowledge", acknowledgeAlarm);

module.exports = router;