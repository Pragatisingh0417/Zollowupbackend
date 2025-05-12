const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

console.log("✅ authRoutes.js loaded");

// 📌 GOOGLE AUTH (keep only if you use it)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      // Ensure the user exists in your database after google authentication.
      const token = jwt.sign(
        { userId: req.user._id, userType: "employee" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Redirect with token as a query parameter to the frontend.
      res.redirect(`http://localhost:3000/dashboard?token=${token}`);
    } catch (error) {
      console.error("❌ Google login error:", error);
      res.status(500).json({ message: "Google authentication failed", error });
    }
  }
);

// ✅ POST /api/auth/login — handle normal login (email + password)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(400).json({ msg: "Invalid credentials" });

    // Check password (Assuming hashed password in DB)
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { userId: employee._id, userType: "employee" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, employee: { id: employee._id, name: employee.name, email: employee.email } });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: "Error occurred during login", error });
  }
});

// ✅ GET /api/auth/me — return current authenticated user (Protected)
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

// ✅ Protect other routes with JWT (Example)
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You have access to this route!" });
});

module.exports = router;
