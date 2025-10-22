import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // ✅ using string instead of ObjectId
    userName: { type: String, required: true },
    courseId: { type: String, required: true }, // ✅ string type
    courseTitle: { type: String, required: true },
    paymentId: { type: String, default: "dummy_payment_id" },
    amount: { type: Number, default: 499 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Enrollment", enrollmentSchema);
