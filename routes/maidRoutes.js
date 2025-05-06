const express = require("express");
const router = express.Router();
const {
  getAllMaids,
  getMaidById,
  createMaid,
  updateMaid,
  deleteMaid,
} = require("../controllers/maidController");

// Routes for CRUD operations
router.get("/", getAllMaids); // Get all maids
router.get("/:id", getMaidById); // Get maid by ID
router.post("/", createMaid); // Create a new maid
router.put("/:id", updateMaid); // Update an existing maid
router.delete("/:id", deleteMaid); // Delete a maid

module.exports = router;
