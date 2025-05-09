// routes/reviewRoutes.js

const express = require("express");
const router = express.Router();
const {submitReview } = require("../controllers/reviewController");

//api/reviews/submit
router.post("/submit", submitReview);

module.exports = router;
