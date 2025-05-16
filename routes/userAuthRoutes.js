// 📁 routes/userAuthRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const router = express.Router();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const url = `http://localhost:3000/verify-email/${token}`;
  const html = `<p>Click <a href="${url}">here</a> to verify your email.</p>`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    html,
  });
};

// POST /api/users/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ msg: "All fields required" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(20).toString("hex");

  const user = new User({ name, email, password: hashedPassword, verificationToken: token, isVerified: false });
  await user.save();

  try {
    await sendVerificationEmail(email, token);
    res.status(201).json({ msg: "Registered! Check your email to verify." });
  } catch (err) {
    res.status(500).json({ msg: "Failed to send verification email" });
  }
});

// GET /api/users/verify-email/:token
router.get("/verify-email/:token", async (req, res) => {
  const user = await User.findOne({ verificationToken: req.params.token });
  if (!user) return res.status(400).json({ msg: "Invalid or expired token." });

  user.emailVerified = true;
  user.verificationToken = undefined;
  await user.save();

  // Redirect or show success
return res.redirect("http://localhost:3000/user/login?verified=true");
});


// POST /api/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });
  if (!user.emailVerified) return res.status(403).json({ message: "    Please verify your email first." });

  const token = jwt.sign(
    { userId: user._id, userType: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email }, token });
});



module.exports = router;
