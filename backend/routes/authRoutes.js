import { Router } from "express";
import { register, verifyOtp, login, logout, getMe, forgotPassword, resetPassword, resendOTP } from "../controllers/authController.js";
import { changePassword } from "../controllers/changePasswordController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter, otpLimiter } from "../middleware/rateLimiter.js";

const router = Router();
router.post("/register",        authLimiter, register);
router.post("/verify-otp",      verifyOtp);
router.post("/login",           authLimiter, login);
router.post("/logout",          protect, logout);
router.get("/me",               protect, getMe);
router.post("/forgot-password", otpLimiter, forgotPassword);
router.post("/reset-password",  resetPassword);
router.post("/resend-otp",      otpLimiter, resendOTP);
router.patch("/change-password",protect, changePassword);
export default router;
