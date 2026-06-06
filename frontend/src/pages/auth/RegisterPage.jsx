import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

const schema = z.object({
  fullName:    z.string().min(2, "Full name required"),
  email:       z.string().email("Valid email required"),
  mobile:      z.string().regex(/^[6-9]\d{9}$/, "Valid Indian mobile number required"),
  companyName: z.string().min(2, "Company / property name required"),
  password:    z.string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "At least one uppercase letter")
    .regex(/[0-9]/, "At least one number")
    .regex(/[^A-Za-z0-9]/, "At least one special character"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      const res = await axiosInstance.post("/auth/register", payload);
      toast.success("OTP sent to your email!");
      navigate("/verify-otp", { state: { email: payload.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 py-12">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="font-cinzel text-3xl text-gold tracking-[4px]">ATITHYA</h1>
            <p className="text-[#9BB0C9] text-xs tracking-widest mt-1">BY SHRI PERUMAL</p>
          </Link>
          <h2 className="font-cinzel text-ivory text-2xl">Create Account</h2>
          <p className="text-[#8EA8C3] text-sm mt-1">Join Atithya today</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="space-y-4">
            {[
              { name: "fullName",    label: "Full Name *",             type: "text",  placeholder: "Your full name" },
              { name: "email",       label: "Email Address *",         type: "email", placeholder: "work@email.com" },
              { name: "mobile",      label: "Mobile Number *",         type: "tel",   placeholder: "10-digit mobile" },
              { name: "companyName", label: "Hotel / Company Name *",  type: "text",  placeholder: "e.g. The Grand Palace Hotel" },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="label-field">{label}</label>
                <input type={type} className="input-field" placeholder={placeholder} {...register(name)} />
                {errors[name] && <p className="error-text">{errors[name].message}</p>}
              </div>
            ))}

            <div>
              <label className="label-field">Password *</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} className="input-field pr-10" placeholder="Strong password" {...register("password")} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="error-text">{errors.password.message}</p>}
              <p className="text-gray-400 text-xs mt-1">Min 8 chars, 1 uppercase, 1 number, 1 special character</p>
            </div>

            <div>
              <label className="label-field">Confirm Password *</label>
              <input type="password" className="input-field" placeholder="Repeat password" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
            </div>

            <button onClick={handleSubmit(onSubmit)} disabled={loading} className="btn-gold w-full py-3.5 disabled:opacity-60">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <div className="mt-5 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-gold font-medium hover:underline">Sign in</Link>
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
