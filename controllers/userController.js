import User from "../models/User.js";
import AdminUserTracking from "../models/AdminUserTracking.js"; // <-- IMPORT THE NEW MODEL
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ REGISTER USER (Updated to log activity)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    // ✅ NEW: Log the registration activity
    await AdminUserTracking.create({
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      action: "User Registered", // This is the default, but we can be explicit
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ✅ LOGIN USER (No changes needed here)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    });

    // Optional: You could also log logins here
    // await AdminUserTracking.create({
    //   userId: user._id,
    //   name: user.name,
    //   email: user.email,
    //   action: "User Logged In",
    // });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// --- NEW FUNCTION FOR ACTIVITY LOG ---

// @desc    Get all user activity logs
// @route   GET /api/activity
// @access  Private/Admin
export const getAllUserActivity = async (req, res) => {
  try {
    // Fetch all activity logs, sort by newest first
    const activityLogs = await AdminUserTracking.find({}).sort({ createdAt: -1 });
    res.status(200).json(activityLogs);
  } catch (error) {
    console.error('Error fetching activity logs:', error.message);
    res.status(500).json({ message: 'Server Error: Could not fetch activity logs.' });
  }
};


// --- EXISTING FUNCTIONS FOR USER MANAGEMENT (No changes) ---

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Server Error: Could not fetch users.' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).json({ message: 'Server Error: Could not fetch user details.' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: 'Server Error: Could not delete user.' });
  }
};