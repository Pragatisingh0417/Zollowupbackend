require("dotenv").config();
const connectDB = require("./config/db"); 
const app = require("./app");

// Function to start the server
const startServer = async () => {
  try {
    await connectDB(); 
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1); 
  }
};

startServer();
