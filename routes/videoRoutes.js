import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs"; // ✅ ADD THIS LINE
import { fileURLToPath } from "url";
import { getAllVideos, uploadVideo, deleteVideo } from "../controllers/videoController.js";

const router = express.Router();

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads", "videos");
if (!fs.existsSync(uploadsDir)) { // This line will now work
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads/videos directory");
}

// Multer configuration with absolute path
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid overwrites
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  }
});

// Define routes
router.get("/", getAllVideos);
router.post("/upload", upload.single("video"), uploadVideo);
router.delete("/:id", deleteVideo);

export default router;