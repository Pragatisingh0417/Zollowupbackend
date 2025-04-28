const express = require("express");
// const bcrypt = require("bcryptjs"); 
const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/authMiddleware"); // Protect routes
const router = express.Router();

// 🟢 CREATE - Register a new employee (removed authMiddleware)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, position } = req.body;

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password before saving
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Create new employee with userId association
    const newEmployee = new Employee({
      name,
      email,
      password,
      // password: hashedPassword, 
      position,
      userId,

    });

    await newEmployee.save();

    res.status(201).json({ message: "Employee registered successfully", employee: newEmployee });
  } catch (error) {
    res.status(500).json({ message: "Error registering employee", error });
  }
});


// 🔵 READ - Get all employees for a specific user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find({ userId: req.employee.userId });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
});

// 🟡 UPDATE - Update employee details
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: req.params.id, userId: req.employee.userId }, // Ensure only the owner can update
      req.body,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found or unauthorized" });
    }

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
});

// 🔴 DELETE - Remove an employee
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedEmployee = await Employee.findOneAndDelete({
      _id: req.params.id,
      userId: req.employee.userId, // Ensure only the owner can delete
    });

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found or unauthorized" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
});

module.exports = router;
