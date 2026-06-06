// VerifyOTPPage.jsx
import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/authSlice";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

export default function VerifyOTPPage() {
  const [otp,     setOtp]     = useState(["","","","","",""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const email      = state?.email || "";

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpStr = otp.join("");
    if (otpStr.length !== 6) return toast.error("Enter all 6 digits");
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/verify-otp", { email, otp: otpStr });
      dispatch(setUser(data.data.user));
      toast.success("Account verified! Welcome to Atithya.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
      setOtp(["","","","","",""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axiosInstance.post("/auth/resend-otp", { email, type: "email_verification" });
      toast.success("New OTP sent!");
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="font-cinzel text-3xl text-gold tracking-[4px]">ATITHYA</h1>
          </Link>
          <h2 className="font-cinzel text-ivory text-2xl">Verify Your Email</h2>
          <p className="text-[#8EA8C3] text-sm mt-2">
            We've sent a 6-digit OTP to<br />
            <span className="text-gold">{email}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-11 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none transition-colors"
              />
            ))}
          </div>

          <button onClick={handleVerify} disabled={loading} className="btn-gold w-full py-3.5 disabled:opacity-60 mb-4">
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Didn't receive the OTP?{" "}
            <button onClick={handleResend} disabled={resending} className="text-gold font-medium hover:underline disabled:opacity-50">
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
