const express = require("express");
const router = express.Router();
const { getHistorical } = require("../controllers/historical");
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/role");

router.get("/:machineId", protect, getHistorical);

module.exports = router;