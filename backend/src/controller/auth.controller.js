import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "تێپەڕەوشە نابێت کەمتر بێت لە 6 پیت" });
    }

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "تکایە هەموو خانەکان پڕ بکەن" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "ئیمەیڵ بەکارهاتوە" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        message: "تۆمارکردن سەرکەوتوو بوو",
        user: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      res.status(400).json({ message: "تۆمارکردن سەرکەوتوو نەبوو" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "کێشە ڕویدا لە کۆنتڕۆڵەری یوزەر" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "ئیمەیڵ   یان تێپەڕەوشە هەڵەیە" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "تێپەڕەوشە هەڵەیە" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      message: "چوونەژوورەوە سەرکەوتوو بوو",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "کێشە ڕویدا لە کۆنتڕۆڵەری یوزەر" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "چوونەدەرەوە سەرکەوتوو بوو" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "کێشە ڕویدا لە کۆنتڕۆڵەری یوزەر" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "تکایە وێنەی نوێ بنێرە" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true },
    );
    res.status(200).json({ message: "پڕۆفایل گۆڕدرا", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "کێشە ڕویدا لە کۆنتڕۆڵەری یوزەر" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "تۆ هەژمارێکی دروستت هەیە", user: req.user });
  } catch (error) {
    console.error("Check auth error:", error);
    res.status(500).json({ message: "کێشە ڕویدا لە کۆنتڕۆڵەری یوزەر" });
  }
};
