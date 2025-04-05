require("dotenv").config(); // This will read the .env file
 
const jwt = require("jsonwebtoken");
 
const authMiddleware = (req, res, next) => {
  // Check if TEST_MODE is enabled
  if (process.env.TEST_MODE === "true") {
    console.log("🟢 TEST MODE ENABLED: Skipping authentication.");
    return next(); // Skip authentication in test mode
  }
 
  // 🔐 Normal authentication flow
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
 
  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.employee = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};
 
module.exports = authMiddleware;