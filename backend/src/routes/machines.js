const express = require('express');
const router = express.Router();
const { getMachines, getMachine, updateMachine } = require("../controllers/machine");
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/role");

router.get("/", protect, getMachines);
router.get("/:id", protect, getMachine);
router.patch("/:id/status", protect, requireRole("Admin"), updateMachine);

module.exports = router;