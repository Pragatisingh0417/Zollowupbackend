const express = require("express");
const bcrypt = require("bcryptjs"); // Required for password hashing during login
const jwt = require("jsonwebtoken"); // Required for creating JWT tokens
const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/authMiddleware"); // Protect routes
const router = express.Router();

// 🟢 LOGIN - Employee login (Only email and password required)
// This is under the /api/employees/login route now
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password (if hashed, use bcrypt to compare)
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token on successful login
    const token = jwt.sign(
      { userId: employee._id, userType: "employee" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      employee: {
        id: employee._id,
        email: employee.email,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// 🔵 READ - Get all employees (if needed)
// This is under the /api/employees route now
router.get("/", authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find({}); // Removed userId association since it might not be needed
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
});

// 🟡 UPDATE - Update employee details (If needed)
// This is under the /api/employees/:id route now
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: req.params.id }, // Removed userId restriction for now (assuming admin role or similar is responsible for updates)
      req.body,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
});

// 🔴 DELETE - Remove an employee (if needed)
// This is under the /api/employees/:id route now
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedEmployee = await Employee.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
});

// Exporting the routes with /api/employees prefix
module.exports = router;
