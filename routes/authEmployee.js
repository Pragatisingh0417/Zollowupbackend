const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const router = express.Router();

// Only register via manual backend (admin access)
router.post("/register", async (req, res) => {
  const { name, email, password, position, userId } = req.body;

  const existing = await Employee.findOne({ email });
  if (existing) return res.status(400).json({ msg: "Employee already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const employee = new Employee({ name, email, password: hashedPassword, position, userId });
  await employee.save();

  res.status(201).json({ msg: "Employee registered successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const employee = await Employee.findOne({ email });
  if (!employee) return res.status(401).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ userId: employee._id, userType: "employee" }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({
    token,
    employee: {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      position: employee.position,
    },
  });
});

module.exports = router;
