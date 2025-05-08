// controllers/reviewController.js
const Review = require("../models/Review");

// @desc    Submit a new review
// @route   POST /api/reviews
// @access  Public or Protected (based on your setup)
exports.submitReview = async (req, res) => {
  try {
    const { bookingId, rating, review } = req.body;

    if (!bookingId || !rating || !review) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newReview = new Review({ bookingId, rating, review });
    await newReview.save();

    res.status(201).json({ message: "Review submitted successfully." });
  } catch (error) {
    console.error("Submit review error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
