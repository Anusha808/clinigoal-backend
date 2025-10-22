import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Video from "../models/Video.js";
import Note from "../models/Note.js";

const router = express.Router();

// ✅ Admin Dashboard Stats (no Payment model)
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalVideos = await Video.countDocuments();
    const totalNotes = await Note.countDocuments();

    // Dummy revenue for now
    const totalRevenue = totalCourses * 500; // example formula

    res.json({
      totalUsers,
      totalCourses,
      totalVideos,
      totalNotes,
      totalRevenue,
    });
  } catch (err) {
    console.error("❌ Error fetching admin stats:", err);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

export default router;
