import User from "../models/User.js";
import UserTracking from "../models/UserTracking.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // ✅ Create initial tracking record
    await UserTracking.create({
      userId: user._id,
      name: user.name,
      email: user.email,
      lastLogin: new Date(),
      purchaseTime: null,
      quizScore: 0,
      assignmentSubmitted: false,
      certificateStatus: "pending",
      active: true,
    });

    res.status(201).json({
      message: "User registered successfully ✅",
      user,
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Update user tracking info dynamically
    await UserTracking.findOneAndUpdate(
      { userId: user._id },
      {
        lastLogin: new Date(),
        active: true,
      },
      { new: true, upsert: true }
    );

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful ✅",
      token,
      user,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// ✅ Logout User (optional tracking)
export const logoutUser = async (req, res) => {
  try {
    const { email } = req.body;
    await UserTracking.findOneAndUpdate(
      { email },
      { active: false },
      { new: true }
    );
    res.status(200).json({ message: "Logout successful ✅" });
  } catch (err) {
    console.error("❌ Logout error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
};
