import express from "express";
import Enrollment from "../models/Enrollment.js";
import Approval from "../models/Approval.js";

const router = express.Router();

/* ============================
   ✅ CREATE NEW ENROLLMENT (DEBUG VERSION)
============================ */
router.post("/", async (req, res) => {
  console.log("🚨 [DEBUG] POST /api/enrollments route was hit!");
  console.log("🚨 [DEBUG] Request body:", req.body);

  try {
    const { userId, userName, courseId, courseTitle, paymentId, amount } = req.body;

    // 1. Validate Input
    if (!userId || !courseId) {
      console.log("❌ [DEBUG] Validation failed: Missing userId or courseId");
      return res.status(400).json({ success: false, message: "Missing userId or courseId" });
    }
    console.log("✅ [DEBUG] Input validation passed.");

    // 2. Check for Duplicate
    console.log("🔍 [DEBUG] Checking for duplicate enrollment...");
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      console.log("❌ [DEBUG] Duplicate enrollment found.");
      return res.status(400).json({ success: false, message: "Already enrolled in this course" });
    }
    console.log("✅ [DEBUG] No duplicate found.");

    // 3. Create Enrollment Document
    const enrollmentData = {
      userId,
      userName,
      courseId,
      courseTitle,
      paymentId: paymentId || "dummy_payment_id",
      amount: amount || 499,
      status: "pending",
    };
    console.log("💾 [DEBUG] Creating enrollment document with data:", enrollmentData);

    const enrollment = new Enrollment(enrollmentData);
    await enrollment.save();
    console.log("✅ [DEBUG] Enrollment saved to DB:", enrollment._id);

    // 4. Create Approval Document
    const approvalData = {
      userId,
      userName,
      courseId,
      courseTitle,
      paymentId: paymentId || "dummy_payment_id",
      status: "pending",
    };
    console.log("💾 [DEBUG] Creating approval document with data:", approvalData);

    const approval = new Approval(approvalData);
    await approval.save();
    console.log("✅ [DEBUG] Approval saved to DB:", approval._id);

    // 5. Send Success Response
    res.status(201).json({
      success: true,
      message: "Enrollment created and sent for admin approval.",
      enrollment,
      approval,
    });

  } catch (err) {
    // ✅ THIS IS THE MOST IMPORTANT LOG FOR DEBUGGING!
    console.error("🚨 [DEBUG] ENROLLMENT CREATION FAILED:", err);
    console.error("🚨 [DEBUG] Full error stack:", err.stack);

    res.status(500).json({
      success: false,
      message: "Server error while creating enrollment.",
      error: err.message, // Send the error message to the frontend
    });
  }
});

// ✅ GET ALL ENROLLMENTS (Admin)
router.get("/", async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: enrollments.length, enrollments });
  } catch (err) {
    console.error("❌ [DEBUG] Error fetching all enrollments:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET ENROLLMENTS BY USER
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🔍 [DEBUG] Fetching enrollments for user: ${userId}`);
    const enrollments = await Enrollment.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: enrollments.length, enrollments });
  } catch (err) {
    console.error("❌ [DEBUG] Error fetching user enrollments:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ UPDATE ENROLLMENT STATUS (Admin Approve/Reject)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(`🔄 [DEBUG] Updating enrollment ${id} to status: ${status}`);

    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid or missing status." });
    }

    const updated = await Enrollment.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Enrollment not found." });
    }

    // Sync status with approval
    await Approval.findOneAndUpdate(
      { userId: updated.userId, courseId: updated.courseId },
      { status }
    );

    console.log(`✅ [DEBUG] Enrollment ${id} updated to: ${status}`);
    res.json({ success: true, message: `Enrollment ${status} successfully.`, updated });
  } catch (err) {
    console.error("❌ [DEBUG] Error updating enrollment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;