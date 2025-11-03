const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration — allow Vercel frontend
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "https://socialmediapost-git-main-albin-alosious-projects.vercel.app",
    "https://socialmediapost-emehqlqbr-albin-alosious-projects.vercel.app",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ✅ Middleware
app.use(express.json({ limit: "10mb" }));

// ✅ Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};
connectDB();

// ✅ API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));

// ✅ Serve frontend (for local or combined deployment only)
const frontendPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 API base URL: http://localhost:${PORT}/api`);
});