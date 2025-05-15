const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false },
  googleId: {
  type: String,
},
emailVerified: {
  type: Boolean,
  default: false, // Only true after email verification
}
});

module.exports = mongoose.model("User", userSchema);
