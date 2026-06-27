const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            // Safeguard: protect should always run first 
            return res.status(401).json({ message: "Not authorized" });
        }

        if(!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        
        next();
    }
}

module.exports = { authorizeRoles };