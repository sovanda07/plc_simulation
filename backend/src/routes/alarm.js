const express = require('express');
const router = express.Router();
const { getAlarms, acknowledgeAlarm } = require("../controllers/alarm");
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/role");

router.get("/", protect, getAlarms);
router.patch("/:id/acknowledge", protect, acknowledgeAlarm);

module.exports = router;