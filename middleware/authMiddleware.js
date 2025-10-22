import jwt from "jsonwebtoken";
import User from "../models/User.js"; // make sure you have a User model

export const protect = async (req, res, next) => {
  let token;

  try {
    // Expect Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      next();
    } else {
      return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
