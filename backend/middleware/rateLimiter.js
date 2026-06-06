import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 10, message: { success: false, message: "Too many attempts. Try again after 15 minutes." }, standardHeaders: true, legacyHeaders: false });
export const apiLimiter  = rateLimit({ windowMs: 15*60*1000, max: 200, message: { success: false, message: "Too many requests." }, standardHeaders: true, legacyHeaders: false });
export const otpLimiter  = rateLimit({ windowMs: 60*60*1000, max: 5,   message: { success: false, message: "Too many OTP requests." } });
