import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

// ✅ Initialize Express App
const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local frontend
      "https://clinigoal.vercel.app", // Main frontend (users)
      "https://clinigoal-admin.vercel.app", // Admin dashboard
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));

// ✅ Setup directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 'uploads' folder created automatically.");
}

// ✅ Import all route files
import userRoutes from "./routes/userRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import noteRoutes from "./routes/notesRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import approvalRoutes from "./routes/approvalRoutes.js";
import adminUserTrackingRoutes from "./routes/adminUserTrackingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import userProgressRoutes from "./routes/userProgressRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js"; // ✅ NEW: Certificate generation route

// ✅ Register API routes
app.use("/api/users", userRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/progress", userProgressRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/admin/user-tracking", adminUserTrackingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/certificates", certificateRoutes); // ✅ Add Certificate route

// ✅ Serve uploaded files (videos, images, certificates, etc.)
app.use("/uploads", express.static(uploadDir));

// ✅ Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ Clinigoal backend is running successfully!",
    database: "MongoDB Connected",
    paymentMode: process.env.RAZORPAY_KEY_ID
      ? "LIVE PAYMENT MODE"
      : "DUMMY PAYMENT MODE",
    features: {
      reviews: "✅ Review Management System Active",
      userTracking: "✅ User Activity Tracking Active",
      detailedProgress: "✅ Detailed Course Progress Tracking Active",
      certificate: "✅ Certificate Generation Active", // ✅ Added
      courses: "✅ Course Management",
      videos: "✅ Video Management",
      quizzes: "✅ Quiz System",
      payments: "✅ Payment Processing",
      enrollments: "✅ Enrollment Tracking",
    },
  });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "❌ API endpoint not found",
    route: req.originalUrl,
    availableEndpoints: [
      "/api/users",
      "/api/activity",
      "/api/progress",
      "/api/courses",
      "/api/videos",
      "/api/notes",
      "/api/quizzes",
      "/api/reviews",
      "/api/approvals",
      "/api/payments",
      "/api/enrollments",
      "/api/certificates", // ✅ Added to list
    ],
  });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error:
      process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Clinigoal backend running on port ${PORT}`);
  console.log("📊 Available API Endpoints:");
  console.log("   • GET  /api/activity - Get all user activity");
  console.log("   • GET  /api/progress/user/:userId - Get detailed progress for a user");
  console.log("   • PUT  /api/progress/video - Update video watch time");
  console.log("   • PUT  /api/progress/quiz - Update quiz score");
  console.log("   • PUT  /api/progress/assignment - Mark assignment as submitted");
  console.log("   • PUT  /api/progress/certificate - Mark certificate as generated");
  console.log("   • POST /api/certificates/generate - Generate a user certificate ✅");
  console.log("   • GET  /api/users - Get all users");
  console.log("   • POST /api/users/register - Register a new user");
  console.log("   • POST /api/users/login - Login a user");
  console.log("   • GET  /api/reviews - Get all reviews");
  console.log("   • POST /api/reviews - Create a review");
  console.log("   • GET  /api/reviews/stats - Get review statistics");

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn("⚠️ Razorpay keys missing — running in DUMMY PAYMENT MODE!");
  } else {
    console.log("💳 Razorpay keys loaded successfully (LIVE MODE)!");
  }
});
