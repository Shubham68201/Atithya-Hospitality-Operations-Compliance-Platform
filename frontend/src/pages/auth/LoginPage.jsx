// LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../features/auth/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

const schema = z.object({
  email:    z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    dispatch(clearError());
    const res = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(res)) {
      toast.success(`Welcome back, ${res.payload.fullName.split(" ")[0]}!`);
      navigate("/dashboard");
    } else if (res.payload?.includes("not verified")) {
      navigate("/verify-otp", { state: { email: data.email } });
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="font-cinzel text-3xl text-gold tracking-[4px]">ATITHYA</h1>
            <p className="text-[#9BB0C9] text-xs tracking-widest mt-1">BY SHRI PERUMAL</p>
          </Link>
          <h2 className="font-cinzel text-ivory text-2xl">Welcome Back</h2>
          <p className="text-[#8EA8C3] text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="label-field">Email Address</label>
              <input type="email" className="input-field" placeholder="your@email.com" {...register("email")} />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  className="input-field pr-10"
                  placeholder="Your password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-gold text-sm hover:underline">Forgot password?</Link>
            </div>

            <button onClick={handleSubmit(onSubmit)} disabled={loading} className="btn-gold w-full py-3.5 disabled:opacity-60">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="mt-5 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-gold font-medium hover:underline">Register here</Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link to="/" className="text-[#5A7A9A] text-xs hover:text-[#9BB0C9] transition-colors">← Back to website</Link>
        </p>
      </motion.div>
    </div>
  );
}
