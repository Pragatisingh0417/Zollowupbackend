const express = require("express");
const { getAllUsers, createUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// ✅ Route to register a new user (Signup)
router.post("/register", createUser);


// ✅ Route to get all users (Protected)
router.get("/", authMiddleware, getAllUsers);

// ✅ Fetch user by ID (Protected)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Test API Route
router.get("/test", (req, res) => {
  res.status(200).json({ message: "🚀 Test API is working!" });
});

// PUT: Update user account details
router.put("/account-details/:email", async (req, res) => {
  const { email } = req.params;
  const { name, altMobile, altHint } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { name, altMobile, altHint } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Account details updated", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
