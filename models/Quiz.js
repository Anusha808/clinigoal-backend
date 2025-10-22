import mongoose from "mongoose";

// Sub-schema for each question
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
});

// Main quiz schema
const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    questions: [questionSchema], // An array of question objects
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);