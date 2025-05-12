const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = express.Router();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',  // or any other email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send email
const sendVerificationEmail = async (email, verificationToken) => {
const verificationUrl = `http://localhost:3000/verify-email/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending verification email:", error.message);
  }
};


// Route to register a new user (Signup)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ msg: "All fields required" });

  // Check if the user already exists
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // Create the new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,  // New user is not verified initially
    });

    // Save user to database
    await user.save();

    // Send the verification email
    await sendVerificationEmail(email, verificationToken);

    return res.status(201).json({
      msg: "User registered successfully. Please verify your email.",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ msg: "Server error during registration." });
  }
});

// Route to verify email
router.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;

  // Find the user with the matching verification token
  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token." });
    }

    // Set the user as verified
    user.isVerified = true;
    user.verificationToken = undefined;  // Remove verification token after use
    await user.save();

    res.status(200).json({ msg: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ msg: "Server error during email verification." });
  }
});

// Route to login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ msg: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, userType: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error during login." });
  }
});

module.exports = router;
