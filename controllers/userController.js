const User = require("../models/User");

// ✅ Create & Save a New User
exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body); // Create user from request data
    await newUser.save(); // Save to MongoDB
    res.status(201).json(newUser); // Respond with created user
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
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
    res.status(500).json({
      success: false,
      message: "Database connection error",
      error: error.message,
    });
  }
};
