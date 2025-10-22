import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    image: { type: String },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course; // ✅ THIS LINE IS REQUIRED
