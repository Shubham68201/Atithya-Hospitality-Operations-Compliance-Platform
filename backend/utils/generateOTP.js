import OTP from "../models/OTP.js";

export const saveOTP = async (email, type) => {
  await OTP.deleteMany({ email, type });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRE_MINUTES) || 10) * 60 * 1000);
  await OTP.create({ email, otp, type, expiresAt });
  return otp;
};

export const verifyOTP = async (email, otp, type) => {
  const record = await OTP.findOne({ email, otp, type, used: false, expiresAt: { $gt: new Date() } });
  if (!record) return null;
  record.used = true;
  await record.save();
  return record;
};
