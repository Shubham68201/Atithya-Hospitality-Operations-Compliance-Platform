import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.atithya_token;
    if (!token) return res.status(401).json({ success: false, message: "Not authorized. Please login." });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "User no longer exists." });
    if (!user.isActive) return res.status(403).json({ success: false, message: "Account suspended." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Token invalid or expired." });
  }
};
