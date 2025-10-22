import UserTracking from "../models/UserTracking.js";

/**
 * 📊 Get all tracked users (for Admin Dashboard)
 * Sorted by most recent update (latest first)
 */
export const getAllTrackedUsers = async (req, res) => {
  try {
    const users = await UserTracking.find().sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("❌ Error fetching user tracking data:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user tracking data",
      error: err.message,
    });
  }
};

/**
 * 🧠 Create a new user tracking record
 * Triggered automatically after registration or login
 */
export const createUserTracking = async (req, res) => {
  try {
    const { userId, name, email, action } = req.body;

    // 🧩 Validate required fields
    if (!userId || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, name, or email",
      });
    }

    // 🔍 Check if a tracking record already exists
    let existingTracking = await UserTracking.findOne({ userId });

    if (existingTracking) {
      // Update recent activity instead of duplicating record
      existingTracking.action = action || "User Logged In";
      existingTracking.updatedAt = new Date();
      await existingTracking.save();

      return res.status(200).json({
        success: true,
        message: "✅ User tracking updated successfully",
        tracking: existingTracking,
      });
    }

    // 🆕 Create new tracking record
    const newTracking = new UserTracking({
      userId,
      name,
      email,
      action: action || "User Registered",
    });

    await newTracking.save();

    res.status(201).json({
      success: true,
      message: "✅ New user tracking record created successfully",
      tracking: newTracking,
    });
  } catch (err) {
    console.error("❌ Error creating user tracking record:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create user tracking record",
      error: err.message,
    });
  }
};

/**
 * 🎓 Approve or Reject certificate for a user
 * Used by admin after verifying user completion
 */
export const updateCertificateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" | "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate status. Must be 'approved' or 'rejected'.",
      });
    }

    const user = await UserTracking.findByIdAndUpdate(
      id,
      { certificateStatus: status, updatedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tracking record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `🎓 Certificate ${status} successfully`,
      user,
    });
  } catch (err) {
    console.error("❌ Error updating certificate status:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update certificate status",
      error: err.message,
    });
  }
};
