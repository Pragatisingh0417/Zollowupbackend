const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const router = express.Router();

// 📌 LOGIN - POST /api/auth/login
// POST /login - Employee login
// Improved error handling in backend
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: employee._id, userType: "employee" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        position: employee.position,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: process.env.NODE_ENV === 'development' ? error.stack : "Internal Server Error" });
  }
});



module.exports = router;
