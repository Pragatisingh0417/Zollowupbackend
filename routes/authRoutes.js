const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Debug log to confirm route is loaded
console.log("✅ authRoutes.js loaded");

// 📌 REGISTER - POST /api/auth/register
router.post("/register", async (req, res) => {
  console.log("📌 Register endpoint hit!");

  const { name, email, password, position, userId } = req.body;

  if (!name || !email || !password || !position || !userId) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    let employee = await Employee.findOne({ email });
    if (employee) return res.status(400).json({ msg: "Employee already exists" });

    // Save the plain text password (without hashing)
    employee = new Employee({ name, email, password, position, userId });
    await employee.save();

    res.status(201).json({ msg: "Employee registered successfully!" });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 LOGIN - POST /api/auth/login
router.post("/login", async (req, res) => {
  console.log("📌 Login endpoint hit!");

  const { email, password } = req.body;
  console.log("🛠️ Received email and password:", email, password);  // Debug log

  try {
    const employee = await Employee.findOne({ email });
    console.log("👀 Found employee:", employee); // Debug log

    if (!employee) return res.status(401).json({ msg: "Invalid credentials" });

    // Directly compare the plaintext password (no bcrypt needed)
    if (password !== employee.password) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: employee._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      employee: {
        id: employee._id,         
        userId: employee.userId,  
        name: employee.name,
        email: employee.email,
        position: employee.position,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 GOOGLE AUTH ROUTES
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.redirect(`http://localhost:3000/dashboard?token=${token}`);
    } catch (error) {
      console.error("❌ Google login error:", error);
      res.status(500).json({ message: "Google authentication failed", error });
    }
  }
);

// ✅ GET /api/auth/me — return current authenticated user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(400).json({ message: "Authentication info missing" });
    }

    const employee = await Employee.findById(req.user.userId).select("-password");
    if (!employee) return res.status(404).json({ message: "User not found" });

    res.json(employee);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
