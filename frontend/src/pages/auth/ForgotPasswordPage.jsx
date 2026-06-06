// ForgotPasswordPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { FiMail } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter your email address");
    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("OTP sent if this email is registered");
      navigate("/reset-password", { state: { email } });
    } catch {
      toast.error("Something went wrong. Try again.");
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
          <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
            <FiMail className="text-gold" size={24} />
          </div>
          <h2 className="font-cinzel text-ivory text-2xl">Forgot Password?</h2>
          <p className="text-[#8EA8C3] text-sm mt-1">Enter your registered email address</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-field">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 disabled:opacity-60">
              {loading ? "Sending OTP..." : "Send Reset OTP"}
            </button>
          </form>
          <div className="mt-5 text-center">
            <Link to="/login" className="text-gold text-sm hover:underline">← Back to Login</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
