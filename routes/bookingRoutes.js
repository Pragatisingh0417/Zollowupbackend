const express = require("express");
const { getAllBookings } = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware
const Booking = require("../models/Booking"); // Import the Booking model

const router = express.Router();

// ✅ Get all bookings (protected route)
router.get("/", authMiddleware, getAllBookings);

// ✅ Create a new booking (protected route)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
