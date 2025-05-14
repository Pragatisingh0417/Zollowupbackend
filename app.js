const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const { handleContactForm } = require("./controllers/contactController");

dotenv.config();
const app = express();

// ✅ CORS Configuration
app.use(
cors({
origin: "http://localhost:3000",
credentials: true,
})
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Contact form route
app.post("/contact", handleContactForm);

// ✅ Session and Passport setup
app.use(
session({
secret: process.env.SESSION_SECRET || "supersecretkey",
resave: false,
saveUninitialized: true,
cookie: { secure: process.env.NODE_ENV === "production" },
})
);
app.use(passport.initialize());
app.use(passport.session());

// ✅ Load passport Google strategy
require("./config/passport");

// ✅ Import routes
const userAuthRoutes = require("./routes/userAuthRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const employeeAuthRoutes = require("./routes/employeeAuthRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const locationRoutes = require("./routes/locationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const maidRoutes = require("./routes/maidRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// ✅ Register routes
app.use("/api/users", userAuthRoutes); // register, login, verify
app.use("/api/users", userProfileRoutes); // profile, account update
app.use("/api/employees", employeeAuthRoutes); // login, google login, CRUD
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/maids", maidRoutes);
app.use("/api/reviews", reviewRoutes);

// ✅ Root route
app.get("/", (req, res) => {
res.send("🚀 API is running...");
});

// ✅ Global error handler
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).send("Something went wrong!");
});

module.exports = app;