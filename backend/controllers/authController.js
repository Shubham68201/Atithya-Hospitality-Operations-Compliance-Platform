import User from "../models/User.js";
import { saveOTP, verifyOTP } from "../utils/generateOTP.js";
import { generateToken, sendTokenCookie } from "../utils/generateToken.js";
import { sendOTPEmail, sendWelcomeEmail } from "../services/emailService.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, mobile, companyName, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "Full name, email and password are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered. Please login." });

    const user = await User.create({ fullName, email: email.toLowerCase(), mobile, companyName, password });

    // Generate OTP and attempt to send email
    const otp = await saveOTP(email.toLowerCase(), "email_verification");

    try {
      await sendOTPEmail(email.toLowerCase(), otp, "email_verification");
      return res.status(201).json({
        success: true,
        message: "Registration successful! OTP sent to your email.",
        data:    { email: email.toLowerCase(), userId: user._id },
      });
    } catch (emailError) {
      // Email failed — still succeed but warn the user
      console.error("SMTP error during register:", emailError.message);
      return res.status(201).json({
        success: true,
        message: `Account created! However, email delivery failed (${emailError.message}). Check your spam or use Resend OTP.`,
        data:    { email: email.toLowerCase(), userId: user._id, emailFailed: true },
      });
    }
  } catch (e) {
    console.error("register error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await verifyOTP(email.toLowerCase(), otp, "email_verification");
    if (!record) return res.status(400).json({ success: false, message: "Invalid or expired OTP." });

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isVerified: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const token = generateToken(user._id);
    sendTokenCookie(res, token);
    sendWelcomeEmail(user.email, user.fullName).catch((e) => console.error("Welcome email failed:", e.message));

    return res.status(200).json({ success: true, message: "Email verified! Welcome to Atithya.", data: { user } });
  } catch (e) {
    console.error("verifyOtp error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required." });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user)          return res.status(401).json({ success: false, message: "Invalid email or password." });
    if (!user.isVerified) return res.status(401).json({ success: false, message: "Account not verified. Please check your email for OTP.", data: { email, requiresVerification: true } });
    if (!user.isActive)   return res.status(403).json({ success: false, message: "Account suspended. Contact support." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password." });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    return res.status(200).json({ success: true, message: "Login successful.", data: { user } });
  } catch (e) {
    console.error("login error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const logout = (req, res) => {
  res.cookie("atithya_token", "", {
    httpOnly: true,
    expires:  new Date(0),
    secure:   process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  return res.status(200).json({ success: true, message: "Logged out." });
};

export const getMe = (req, res) =>
  res.status(200).json({ success: true, data: { user: req.user } });

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (user) {
      try {
        const otp = await saveOTP(email.toLowerCase(), "password_reset");
        await sendOTPEmail(email.toLowerCase(), otp, "password_reset");
      } catch (e) { console.error("Forgot password email failed:", e.message); }
    }
    // Always return success to prevent email enumeration
    return res.status(200).json({ success: true, message: "If this email is registered, an OTP has been sent.", data: { email } });
  } catch (e) { return res.status(500).json({ success: false, message: e.message }); }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = await verifyOTP(email.toLowerCase(), otp, "password_reset");
    if (!record) return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ success: true, message: "Password reset successful. Please login." });
  } catch (e) { return res.status(500).json({ success: false, message: e.message }); }
};

export const resendOTP = async (req, res) => {
  try {
    const { email, type = "email_verification" } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: "Email not registered." });
    const otp = await saveOTP(email.toLowerCase(), type);
    try {
      await sendOTPEmail(email.toLowerCase(), otp, type);
      return res.status(200).json({ success: true, message: "OTP resent successfully." });
    } catch (emailError) {
      return res.status(200).json({ success: true, message: `OTP generated but email failed: ${emailError.message}`, data: { emailFailed: true } });
    }
  } catch (e) { return res.status(500).json({ success: false, message: e.message }); }
};
