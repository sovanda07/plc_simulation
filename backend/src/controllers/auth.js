const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        const match = await user.comparePassword(password);

        if (!match) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Sign JWT
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            username: user.username,
            role: user.role
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate password
        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        // Hash password 
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create user
        const user = new User({
            username,
            email,
            password,
            role: role || "Operator"
        });

        await user.save();

        res.status(201).json({ message: "Registration successful" });

    } catch (err) {
        if (err.code === 11000) {
            if (err.keyPattern.email) {
                return res.status(400).json({ message: "Email already exists" });
            }

            if (err.keyPattern.username) {
                return res.status(400).json({ message: "Username already exists" });
            }
        }

        res.status(500).json({ message: err.message });
    }
};