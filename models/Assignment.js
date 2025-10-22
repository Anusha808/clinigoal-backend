import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
