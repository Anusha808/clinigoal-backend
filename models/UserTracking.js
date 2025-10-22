import mongoose from "mongoose";

const userTrackingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },

  lastLogin: { type: Date, default: Date.now },
  purchaseTime: { type: Date },
  quizScore: { type: Number, default: 0 },
  assignmentSubmitted: { type: Boolean, default: false },
  certificateStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  // activity log for each action
  activityLog: [
    {
      action: String,
      timestamp: { type: Date, default: Date.now },
      details: String,
    },
  ],

  active: { type: Boolean, default: false },
});

export default mongoose.model("UserTracking", userTrackingSchema);
