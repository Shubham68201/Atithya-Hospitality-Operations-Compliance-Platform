import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

const schema = z.object({
  newPassword: z.string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "At least one uppercase letter")
    .regex(/[0-9]/, "At least one number")
    .regex(/[^A-Za-z0-9]/, "At least one special character"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const [otp, setOtp]     = useState(["","","","","",""]);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const { state } = useLocation();
  const navigate  = useNavigate();
  const email     = state?.email || "";
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const onSubmit = async (data) => {
    const otpStr = otp.join("");
    if (otpStr.length !== 6) return toast.error("Enter 6-digit OTP");
    setLoading(true);
    try {
      await axiosInstance.post("/auth/reset-password", { email, otp: otpStr, newPassword: data.newPassword });
      toast.success("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="font-cinzel text-3xl text-gold tracking-[4px]">ATITHYA</h1>
          </Link>
          <h2 className="font-cinzel text-ivory text-2xl">Reset Password</h2>
          <p className="text-[#8EA8C3] text-sm mt-1">Enter the OTP sent to {email}</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl space-y-5">
          <div>
            <label className="label-field">6-Digit OTP</label>
            <div className="flex justify-center gap-2 mt-1">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  className="w-10 h-11 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none transition-colors"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="label-field">New Password *</label>
            <div className="relative">
              <input type={showPwd ? "text" : "password"} className="input-field pr-10" placeholder="Strong new password" {...register("newPassword")} />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPwd ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
              </button>
            </div>
            {errors.newPassword && <p className="error-text">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="label-field">Confirm New Password *</label>
            <input type="password" className="input-field" placeholder="Repeat password" {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
          </div>

          <button onClick={handleSubmit(onSubmit)} disabled={loading} className="btn-gold w-full py-3.5 disabled:opacity-60">
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-gold text-sm hover:underline">← Back to Login</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
