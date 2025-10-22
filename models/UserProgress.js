import mongoose from "mongoose";

const UserProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  // --- Video Progress ---
  videos: [
    {
      videoId: { type: mongoose.Schema.Types.ObjectId, required: true },
      watchedDuration: { type: Number, default: 0 }, // in seconds
      totalDuration: { type: Number, default: 0 },   // in seconds
      isCompleted: { type: Boolean, default: false },
    },
  ],
  // --- Assignment Progress ---
  assignment: {
    isSubmitted: { type: Boolean, default: false },
    submissionDate: { type: Date },
    fileName: { type: String }, // Name of the submitted file
  },
  // --- Quiz Progress ---
  quiz: {
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    attempts: [
      {
        score: { type: Number },
        date: { type: Date, default: Date.now },
      },
    ],
    isPassed: { type: Boolean, default: false },
  },
  // --- Certificate Status ---
  certificate: {
    isGenerated: { type: Boolean, default: false },
    generatedDate: { type: Date },
    certificateId: { type: String }, // The unique ID from the certificate generation
  },
}, { timestamps: true });

// Ensure a user can only have one progress document per course
UserProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model("UserProgress", UserProgressSchema);