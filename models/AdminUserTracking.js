import mongoose from "mongoose";

const AdminUserTrackingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      default: "User Registered",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AdminUserTracking", AdminUserTrackingSchema);
