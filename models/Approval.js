import mongoose from "mongoose";

const approvalSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // ✅ use string
    userName: { type: String, required: true },
    courseId: { type: String, required: true }, // ✅ use string
    courseTitle: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Approval", approvalSchema);
