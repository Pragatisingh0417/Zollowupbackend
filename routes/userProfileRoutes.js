const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// ✅ Get all users (Protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Get user by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Update account details
router.put("/account-details/:email", authMiddleware, async (req, res) => {
  const { email } = req.params;
  const { name, altMobile, altHint } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { name, altMobile, altHint } },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Account details updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
