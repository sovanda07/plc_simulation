const express = require('express');
const router = express.Router();
const { getMachines, getMachine, updateMachine } = require("../controllers/machine");

router.get("/", getMachines);
router.get("/:id", getMachine);
router.patch("/:id/status", updateMachine);

module.exports = router;