import mongoose from "mongoose";

const userTrackingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    purchaseTime: {
      type: Date,
    },
    quizScore: {
      type: Number,
      default: 0,
    },
    assignmentSubmitted: {
      type: Boolean,
      default: false,
    },
    certificateStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserTracking = mongoose.model("UserTracking", userTrackingSchema);
export default UserTracking;
