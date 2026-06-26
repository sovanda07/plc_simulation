const User = require("../models/User");

// GET /api/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // never send password
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/users
exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.json({ message: "User created", username: user.username, role: user.role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};