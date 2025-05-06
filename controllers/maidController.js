const Maid = require("../models/Maid");

// Get all maids with optional filters
// controllers/maidController.js

const getAllMaids = async (req, res) => {
    try {
        const { selectedHours } = req.query;
        console.log("Selected Hours received:", selectedHours); // Debug log

        // Replace with actual DB call if connected
        const dummyMaids = [
            { id: 1, name: "Maid 1", hours: 4 },
            { id: 2, name: "Maid 2", hours: 8 },
            { id: 3, name: "Maid 3", hours: 8 },
        ];

        let filtered = dummyMaids;
        if (selectedHours) {
            filtered = dummyMaids.filter(maid => maid.hours == selectedHours);
        }

        res.json(filtered);
    } catch (error) {
        console.error("Error getting maids:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Get maid by ID
const getMaidById = async (req, res) => {
  try {
    const maid = await Maid.findById(req.params.id);
    if (!maid) {
      return res.status(404).json({ message: "Maid not found" });
    }
    res.status(200).json(maid);
  } catch (err) {
    res.status(500).json({ message: "Error fetching maid" });
  }
};

// Create a new maid
const createMaid = async (req, res) => {
  const { name, age, experience, religion, image, availableHours, pricePerHour } = req.body;

  try {
    const newMaid = new Maid({
      name,
      age,
      experience,
      religion,
      image,
      availableHours,
      pricePerHour,
    });

    const savedMaid = await newMaid.save();
    res.status(201).json(savedMaid);
  } catch (err) {
    res.status(500).json({ message: "Error creating maid" });
  }
};

// Update an existing maid
const updateMaid = async (req, res) => {
  try {
    const updatedMaid = await Maid.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMaid) {
      return res.status(404).json({ message: "Maid not found" });
    }
    res.status(200).json(updatedMaid);
  } catch (err) {
    res.status(500).json({ message: "Error updating maid" });
  }
};

// Delete a maid
const deleteMaid = async (req, res) => {
  try {
    const deletedMaid = await Maid.findByIdAndDelete(req.params.id);
    if (!deletedMaid) {
      return res.status(404).json({ message: "Maid not found" });
    }
    res.status(200).json({ message: "Maid deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting maid" });
  }
};

module.exports = {
  getAllMaids,
  getMaidById,
  createMaid,
  updateMaid,
  deleteMaid,
};
