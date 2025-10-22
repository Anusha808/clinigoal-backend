import Course from "../models/Course.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, duration, level } = req.body;
    let thumbnail = "";

    // Handle file upload if present
    if (req.file) {
      thumbnail = `/uploads/${req.file.filename}`;
    }

    const newCourse = new Course({
      title,
      description,
      category,
      duration,
      level,
      thumbnail,
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "🎉 Course created successfully!",
      course: newCourse,
    });
  } catch (error) {
    console.error("❌ Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// ✅ Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

// ✅ Get single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(200).json({ success: true, course });
  } catch (error) {
    console.error("❌ Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};

// ✅ Update a course
export const updateCourse = async (req, res) => {
  try {
    const { title, description, category, duration, level } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Update fields
    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.duration = duration || course.duration;
    course.level = level || course.level;

    // Handle new thumbnail upload
    if (req.file) {
      // Delete old thumbnail if it exists
      if (course.thumbnail && fs.existsSync(path.join(__dirname, `..${course.thumbnail}`))) {
        fs.unlinkSync(path.join(__dirname, `..${course.thumbnail}`));
      }
      course.thumbnail = `/uploads/${req.file.filename}`;
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "✅ Course updated successfully!",
      course,
    });
  } catch (error) {
    console.error("❌ Error updating course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

// ✅ Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Delete thumbnail if exists
    if (course.thumbnail && fs.existsSync(path.join(__dirname, `..${course.thumbnail}`))) {
      fs.unlinkSync(path.join(__dirname, `..${course.thumbnail}`));
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: "🗑️ Course deleted successfully!",
    });
  } catch (error) {
    console.error("❌ Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};
