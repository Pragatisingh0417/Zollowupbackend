const bcrypt = require("bcrypt");
const User = require("../models/User");

// ✅ Create & Save a New User (with password hashing)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate the incoming data
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields (name, email, password) are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with the hashed password
    const newUser = new User({ name, email, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    // Respond with a success message
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Test Route to Check API & DB Connection
exports.testAPI = (req, res) => {
  res.status(200).json({ message: "API is working fine!" });
};

// ✅ Test Route to Check MongoDB Connection
exports.checkUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Database connection error",
      error: error.message,
    });
  }
};
