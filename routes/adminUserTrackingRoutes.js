import express from "express";
import {
  getAllTrackedUsers,
  createUserTracking,
  updateCertificateStatus,
} from "../controllers/adminUserTrackingController.js";

const router = express.Router();

/**
 * 🧠 Create a new user tracking record
 * ----------------------------------------------------
 * Called automatically when:
 * - A user registers
 * - A user logs in
 * - A user completes quizzes or assignments
 * 
 * @route   POST /api/admin/user-tracking
 * @access  Public (auto-triggered by app events)
 */
router.post("/", createUserTracking);

/**
 * 📋 Fetch all user tracking data
 * ----------------------------------------------------
 * Used by the Admin Dashboard to monitor user activities,
 * progress, quiz scores, and certificate statuses.
 * 
 * @route   GET /api/admin/user-tracking
 * @access  Admin
 */
router.get("/", getAllTrackedUsers);

/**
 * 🎓 Approve or reject a user’s certificate
 * ----------------------------------------------------
 * Admin updates certificate status after verification.
 * 
 * @route   PUT /api/admin/user-tracking/:id/certificate
 * @access  Admin
 */
router.put("/:id/certificate", updateCertificateStatus);

export default router;
