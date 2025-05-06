const mongoose = require("mongoose");

const MaidSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    experience: { type: String, required: true },
    religion: { type: String, required: true },
    image: { type: String, required: true }, // URL to the maid's image
    availableHours: { type: [String], required: true }, // Array of hours or availability time
    pricePerHour: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maid", MaidSchema);
