const express = require("express");
const router = express.Router();
const { getUsers, createUser, deleteUser } = require("../controllers/users");
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/role");

router.get("/", protect, authorizeRoles("Admin"), getUsers);
router.post("/", protect, authorizeRoles("Admin"), createUser);
router.delete("/:id", protect, authorizeRoles("Admin"), deleteUser);

module.exports = router;