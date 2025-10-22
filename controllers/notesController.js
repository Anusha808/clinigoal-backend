import fs from "fs";
import path from "path";
import Note from "../models/Note.js";

// Get all notes
export const getAllNotes = async (req, res) => {
  try {
    console.log("🔍 [CONTROLLER] Fetching all notes from database...");
    const notes = await Note.find().sort({ createdAt: -1 });
    console.log(`✅ [CONTROLLER] Found ${notes.length} notes.`);
    res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error("❌ [CONTROLLER] Error fetching notes:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload a new note
export const uploadNote = async (req, res) => {
  try {
    console.log("📤 [CONTROLLER] Note upload request received.");
    console.log("📤 [CONTROLLER] Request body:", req.body);
    console.log("📤 [CONTROLLER] File info:", req.file ? {
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    } : "❌ No file received");

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No note file provided" });
    }

    const { title, courseName } = req.body;
    if (!title || !courseName) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log("🗑️ [CONTROLLER] File deleted due to validation failure.");
      }
      return res.status(400).json({ success: false, message: "Title and courseName are required" });
    }

    // Create the note document
    const newNote = new Note({
      title: title.trim(),
      courseName: courseName.trim(),
      notePath: `uploads/notes/${req.file.filename}`, // Store relative path for URL access
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimetype: req.file.mimetype,
    });

    console.log("💾 [CONTROLLER] Attempting to save note to database...");
    const saved = await newNote.save();
    console.log("✅ [CONTROLLER] Note saved successfully to MongoDB! ID:", saved._id);
    
    res.status(201).json({ 
      success: true, 
      message: "Note uploaded successfully", 
      note: saved 
    });
  } catch (error) {
    console.error("❌ [CONTROLLER] Error uploading note:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log("🗑️ [CONTROLLER] File deleted due to error.");
    }
    res.status(500).json({ 
      success: false, 
      message: "Upload failed: " + error.message 
    });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    console.log(`🗑️ [CONTROLLER] Delete request for note ID: ${req.params.id}`);
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    const filepath = path.resolve(note.notePath);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log("🗑️ [CONTROLLER] File deleted from filesystem.");
    }

    await note.deleteOne();
    console.log("🗑️ [CONTROLLER] Note deleted from database.");
    
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error("❌ [CONTROLLER] Error deleting note:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};