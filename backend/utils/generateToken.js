import jwt from "jsonwebtoken";

export const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" });

export const sendTokenCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("atithya_token", token, {
    httpOnly: true,
    secure:   isProd,              // must be true in prod for sameSite:none
    sameSite: isProd ? "none" : "strict",  // "none" required for cross-origin (Vercel→Render)
    maxAge:   (parseInt(process.env.COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000,
  });
};
