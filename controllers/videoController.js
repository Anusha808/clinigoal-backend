import fs from "fs";
import path from "path";
import Video from "../models/Video.js";

// Get all videos
export const getAllVideos = async (req, res) => {
  try {
    console.log("Fetching all videos from database...");
    const videos = await Video.find().sort({ createdAt: -1 });
    console.log(`Found ${videos.length} videos`);
    res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload a new video
export const uploadVideo = async (req, res) => {
  try {
    console.log("Video upload request received");
    console.log("Request body:", req.body);
    console.log("File info:", req.file ? {
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    } : "No file received");

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No video file provided" });
    }

    const { title, courseName } = req.body;
    if (!title || !courseName) {
      // Clean up the uploaded file if validation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log("File deleted due to validation failure");
      }
      return res.status(400).json({ success: false, message: "Title and courseName are required" });
    }

    // Create the video document
    const newVideo = new Video({
      title: title.trim(),
      courseName: courseName.trim(),
      videoPath: `uploads/videos/${req.file.filename}`, // Store relative path for URL access
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimetype: req.file.mimetype,
    });

    console.log("Attempting to save video to database...");
    const saved = await newVideo.save();
    console.log("✅ Video saved successfully to MongoDB:", saved._id);
    
    res.status(201).json({ 
      success: true, 
      message: "Video uploaded successfully", 
      video: saved 
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    // Clean up the uploaded file if an error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log("File deleted due to error");
    }
    res.status(500).json({ 
      success: false, 
      message: "Upload failed: " + error.message 
    });
  }
};

// Delete a video
export const deleteVideo = async (req, res) => {
  try {
    console.log(`Delete request for video ID: ${req.params.id}`);
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    // Construct the full path to the file
    const filepath = path.resolve(video.videoPath);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log("File deleted from filesystem");
    }

    await video.deleteOne();
    console.log("Video deleted from database");
    
    res.json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};