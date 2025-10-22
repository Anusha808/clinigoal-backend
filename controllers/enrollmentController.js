import Enrollment from "../models/Enrollment.js";
import Approval from "../models/Approval.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// ✅ Create new enrollment (after dummy or real payment)
export const createEnrollment = async (req, res) => {
  try {
    console.log("📩 Incoming enrollment data:", req.body);

    const { userId, userName, courseId, courseTitle, paymentId, amount, status } = req.body;

    // ⚠️ Validate required fields
    if (!userId || !courseId) {
      return res.status(400).json({ success: false, message: "Missing userId or courseId." });
    }

    // 🧠 Check for duplicate enrollment
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course.",
      });
    }

    // 🧠 Try fetching real user and course data
    let user = null;
    let course = null;

    try {
      user = await User.findById(userId).select("name");
    } catch (e) {
      console.warn("⚠️ Skipping user lookup (invalid userId or dummy):", e.message);
    }

    try {
      course = await Course.findById(courseId).select("title");
    } catch (e) {
      console.warn("⚠️ Skipping course lookup (invalid courseId or dummy):", e.message);
    }

    // ✅ Use fallbacks for dummy/test mode
    const resolvedUserName = user?.name || userName || "Test User";
    const resolvedCourseTitle = course?.title || courseTitle || "Untitled Course";

    // ✅ Create Enrollment document
    const enrollment = new Enrollment({
      userId,
      userName: resolvedUserName,
      courseId,
      courseTitle: resolvedCourseTitle,
      paymentId: paymentId || "dummy_payment_id",
      amount: amount || 499,
      status: status || "pending",
    });

    await enrollment.save();

    // ✅ Create matching Approval record for Admin Dashboard
    const approval = new Approval({
      userName: resolvedUserName,
      courseTitle: resolvedCourseTitle,
      paymentId: paymentId || "dummy_payment_id",
      status: "pending",
    });

    await approval.save();

    console.log("✅ Enrollment & Approval created successfully");

    res.status(201).json({
      success: true,
      message: "Enrollment created and sent for admin approval.",
      enrollment,
      approval,
    });
  } catch (err) {
    console.error("❌ Enrollment Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while processing enrollment.",
      error: err.message,
    });
  }
};

// ✅ Fetch all enrollments (for Admin Dashboard)
export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (err) {
    console.error("❌ Error fetching enrollments:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments.",
      error: err.message,
    });
  }
};

// ✅ Fetch user-specific enrollments (for User Dashboard)
export const getUserEnrollments = async (req, res) => {
  try {
    const { userId } = req.params;
    const enrollments = await Enrollment.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (err) {
    console.error("❌ Error fetching user enrollments:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user enrollments.",
      error: err.message,
    });
  }
};

// ✅ Update enrollment status (Admin Approve/Reject)
export const updateEnrollmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Enrollment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Enrollment not found." });
    }

    // 🔁 Sync approval status if exists
    await Approval.findOneAndUpdate(
      { userName: updated.userName, courseTitle: updated.courseTitle },
      { status },
      { new: true }
    );

    console.log(`✅ Enrollment status updated to: ${status}`);
    res.status(200).json({
      success: true,
      message: `Enrollment ${status} successfully.`,
      updated,
    });
  } catch (err) {
    console.error("❌ Error updating enrollment:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update enrollment status.",
      error: err.message,
    });
  }
};
