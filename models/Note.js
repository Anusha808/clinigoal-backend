import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  courseName: { type: String, required: true, trim: true }, // ✅ Use courseName, just like videos
  notePath: { type: String, required: true }, // ✅ Use notePath, just like videoPath
  originalName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimetype: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Note", noteSchema);