const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");

dotenv.config();

const app = express();

// ✅ CORS Middleware (Place this before routes)
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Middleware
app.use(cors()); // Allows cross-origin requests from frontend
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Parses form data


// ✅ Configure express-session (Required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set `true` if using HTTPS
  })
);

// ✅ Initialize Passport and Sessions
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport"); 

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/employees", employeeRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

module.exports = app;
