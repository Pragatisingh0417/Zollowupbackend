const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  position: { type: String, required: true },
  userId: { type: String, required: true }
});

// 🔐 Hash password before saving
// EmployeeSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next(); 
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// 🔍 Compare Password Method
// EmployeeSchema.methods.comparePassword = async function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
// };

module.exports = mongoose.model("Employee", EmployeeSchema);
