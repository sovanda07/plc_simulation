const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true},
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Operator"], default: "Operator" }
}, { timestamps: true });

userSchema.methods.comparePassword = function(password) {
    const bcrypt = require('bcryptjs');
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);