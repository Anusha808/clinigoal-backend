import express from "express";
import Approval from "../models/Approval.js";
import Enrollment from "../models/Enrollment.js";

const router = express.Router();

/* ==========================================================
   ✅ 1. GET all approvals (Admin Dashboard)
   ========================================================== */
router.get("/", async (req, res) => {
  try {
    const approvals = await Approval.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("courseId", "title");

    res.json({
      success: true,
      count: approvals.length,
      approvals,
    });
  } catch (err) {
    console.error("❌ Error fetching approvals:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching approvals.",
      error: err.message,
    });
  }
});

/* ==========================================================
   ✅ 2. CREATE new approval (optional manual creation)
   ========================================================== */
router.post("/", async (req, res) => {
  try {
    const { userId, userName, courseId, courseTitle } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or courseId.",
      });
    }

    // prevent duplicate approvals
    const existing = await Approval.findOne({ userId, courseId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Approval already exists for this course.",
      });
    }

    const newApproval = new Approval({
      userId,
      userName,
      courseId,
      courseTitle,
      status: "pending",
    });

    await newApproval.save();

    res.status(201).json({
      success: true,
      message: "Approval request created successfully.",
      approval: newApproval,
    });
  } catch (err) {
    console.error("❌ Error creating approval:", err);
    res.status(500).json({
      success: false,
      message: "Server error creating approval.",
      error: err.message,
    });
  }
});

/* ==========================================================
   ✅ 3. UPDATE approval status (Admin Approve / Reject)
   ========================================================== */
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const approval = await Approval.findById(req.params.id);
    if (!approval) {
      return res.status(404).json({
        success: false,
        message: "Approval not found.",
      });
    }

    // ✅ Update approval status
    approval.status = status;
    await approval.save();

    // ✅ Sync status with corresponding enrollment
    await Enrollment.findOneAndUpdate(
      { userId: approval.userId, courseId: approval.courseId },
      { status: status === "approved" ? "enrolled" : "rejected" },
      { new: true }
    );

    res.json({
      success: true,
      message: `Approval ${status} and enrollment synced successfully.`,
      approval,
    });
  } catch (err) {
    console.error("❌ Error updating approval:", err);
    res.status(500).json({
      success: false,
      message: "Server error updating approval.",
      error: err.message,
    });
  }
});

/* ==========================================================
   ✅ 4. DELETE approval (optional cleanup)
   ========================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Approval.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Approval not found.",
      });
    }

    // Optional: also clean up related enrollment if needed
    await Enrollment.findOneAndDelete({
      userId: deleted.userId,
      courseId: deleted.courseId,
    });

    res.json({
      success: true,
      message: "🗑️ Approval deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Error deleting approval:", err);
    res.status(500).json({
      success: false,
      message: "Server error deleting approval.",
      error: err.message,
    });
  }
});

export default router;
