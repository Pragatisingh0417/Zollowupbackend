const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs"); 
const router = express.Router();

// Debugging log to ensure this file is loaded
console.log("✅ authRoutes.js loaded");

// 📌 REGISTER - POST /api/auth/register
router.post("/register", async (req, res) => {
  console.log("📌 Register endpoint hit!");

  const { name, email, password, position, userId } = req.body;

  // Validate required fields
  if (!name || !email || !password || !position || !userId) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    let employee = await Employee.findOne({ email });
    if (employee) return res.status(400).json({ msg: "Employee already exists" });

// Hash password before saving
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

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

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(401).json({ msg: "Invalid credentials" });

    const isMatch = await employee.comparePassword(password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ userId: employee._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ 
      token, 
      employee: { 
        id: employee._id, 
        name: employee.name, 
        email: employee.email, 
        position: employee.position 
      } 
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 GOOGLE AUTH ROUTES
// Redirect user to Google for authentication
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Auth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      // Generate JWT Token
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      // Redirect user to frontend with token
      res.redirect(`http://localhost:3000/dashboard?token=${token}`);
    } catch (error) {
      console.error("❌ Google login error:", error);
      res.status(500).json({ message: "Google authentication failed", error });
    }
  }
);


module.exports = router;
