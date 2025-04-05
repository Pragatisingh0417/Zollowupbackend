require("dotenv").config();
const connectDB = require("./config/db"); // Import DB connection
const app = require("./app");
const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000",
   credentials: true }));

app.use("/api/auth", require("./routes/authRoutes"));

const session = require("express-session");
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Function to start the server
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1); // Exit on failure
  }
};

// Start the server
startServer();
