import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "تۆ ناتوانیت ئەم پەڕەیە ببینیت" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "تۆ ناتوانیت ئەم پەڕەیە ببینیت" });
    }

    const user = await User.findById(decoded.userID).select("-password");

    if (!user) {
      return res.status(401).json({ message: "تۆ ناتوانیت ئەم پەڕەیە ببینیت" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "تۆ ناتوانیت ئەم پەڕەیە ببینیت" });
  }
};
