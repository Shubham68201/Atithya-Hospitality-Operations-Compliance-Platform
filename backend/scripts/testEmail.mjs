import dotenv from "dotenv";

dotenv.config();

const { sendOTPEmail } = await import("../services/emailService.js");

try {
  const to = process.env.SMTP_USER;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("Sending test OTP to:", to);
  await sendOTPEmail(to, otp, "email_verification");
  console.log("Test email sent successfully.");
  process.exit(0);
} catch (e) {
  console.error("Test email failed:", e);
  process.exit(1);
}
