import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

// ✅ TEST ROUTE — check if backend is responding
router.get("/test", (req, res) => {
  res.json({ message: "✅ Courses API working fine" });
});

// ✅ CREATE COURSE
router.post("/", async (req, res) => {
  try {
    const { title, description, price, category, image } = req.body;

    // Basic validation
    if (!title || !description || !price) {
      return res
        .status(400)
        .json({ message: "Title, description, and price are required" });
    }

    const newCourse = new Course({
      title,
      description,
      price,
      category: category || "General",
      image: image || "",
    });

    const savedCourse = await newCourse.save();
    console.log("✅ New course created:", savedCourse.title);
    res.status(201).json(savedCourse);
  } catch (err) {
    console.error("❌ Error creating course:", err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

// ✅ GET ALL COURSES
router.get("/", async (req, res) => {
  try {
    console.log("📡 GET /api/courses triggered");
    const courses = await Course.find();
    console.log("✅ Fetched courses:", courses.length);
    res.json(courses);
  } catch (err) {
    console.error("❌ Error fetching courses:", err.message);
    res
      .status(500)
      .json({ message: "Database fetch error", error: err.message });
  }
});

// ✅ GET COURSE BY ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    console.error("❌ Error fetching course:", err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

// ✅ UPDATE COURSE
router.put("/:id", async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCourse)
      return res.status(404).json({ message: "Course not found" });
    res.json(updatedCourse);
  } catch (err) {
    console.error("❌ Error updating course:", err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

// ✅ DELETE COURSE
router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse)
      return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting course:", err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

export default router;
