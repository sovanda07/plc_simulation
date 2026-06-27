const express = require("express");
const router = express.Router();
const { getUsers, createUser, deleteUser } = require("../controllers/users");

router.get("/", protect, requireRole("Admin"), getUsers);
router.post("/", protect, requireRole("Admin"), createUser);
router.delete("/:id", protect, requireRole("Admin"), deleteUser);

module.exports = router;