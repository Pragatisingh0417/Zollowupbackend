const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const { handleContactForm } = require('./controllers/contactController');

dotenv.config();

const app = express();

// ✅ CORS Middleware
app.use(cors({ 
  origin: "http://localhost:3000", 
  credentials: true 
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/contact', handleContactForm); // Ensure this matches the frontend fetch request

// ✅ Session and Passport Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Condition for a  production
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport Strategy Configuration for googleStrategy setup
require("./config/passport");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const locationRoutes = require("./routes/locationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const maidRoutes = require('./routes/maidRoutes');
const reviewRoutes = require("./routes/reviewRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/contact", contactRoutes);  
app.use("/api/maids", maidRoutes); 
app.use("/api/reviews", reviewRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

module.exports = app;
