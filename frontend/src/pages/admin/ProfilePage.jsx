import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../features/auth/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { HiOutlineUser, HiOutlineLockClosed } from "react-icons/hi";

const profileSchema = z.object({
  fullName:    z.string().min(2, "Name required"),
  mobile:      z.string().regex(/^[6-9]\d{9}$/, "Valid Indian mobile required").optional().or(z.literal("")),
  companyName: z.string().min(2, "Company name required").optional().or(z.literal("")),
});

const pwdSchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  newPassword:     z.string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "Uppercase required")
    .regex(/[0-9]/, "Number required")
    .regex(/[^A-Za-z0-9]/, "Special character required"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [tab,     setTab]     = useState("profile");
  const [saving,  setSaving]  = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: user?.fullName || "", mobile: user?.mobile || "", companyName: user?.companyName || "" },
  });

  const pwdForm = useForm({ resolver: zodResolver(pwdSchema) });

  const onProfileSave = async (data) => {
    setSaving(true);
    try {
      const { data: res } = await axiosInstance.put("/users/profile", data);
      dispatch(setUser(res.data.user));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setSaving(false); }
  };

  const onPasswordChange = async (data) => {
    setSaving(true);
    try {
      // Use reset-password flow via OTP is the standard,
      // but for convenience here we patch directly via a protected route.
      await axiosInstance.patch("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully");
      pwdForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally { setSaving(false); }
  };

  const roleBadge = (role) => {
    const map = {
      super_admin: "bg-purple-100 text-purple-700",
      admin:       "bg-blue-100 text-blue-700",
      operations_manager: "bg-teal-100 text-teal-700",
      compliance_manager: "bg-green-100 text-green-700",
      staff:       "bg-yellow-100 text-yellow-700",
      customer:    "bg-gray-100 text-gray-600",
    };
    return map[role] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-cinzel text-navy text-2xl">My Profile</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your account details</p>
      </div>

      {/* User card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="card-elegant flex items-center gap-5 mb-6"
      >
        <div className="w-16 h-16 rounded-full bg-navy/5 border-2 border-navy/10 flex items-center justify-center flex-shrink-0">
          <span className="font-cinzel text-2xl text-navy font-bold">
            {user?.fullName?.[0]?.toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="font-cinzel text-navy text-xl">{user?.fullName}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`badge-status text-xs px-2.5 py-1 rounded-full ${roleBadge(user?.role)}`}>
              {user?.role?.replace(/_/g, " ")}
            </span>
            <span className={`badge-status text-xs px-2.5 py-1 rounded-full ${user?.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {user?.isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {[["profile","Edit Profile",HiOutlineUser],["password","Change Password",HiOutlineLockClosed]].map(([key, label, Icon]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${tab === key ? "bg-white text-navy shadow-sm" : "text-gray-500"}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {tab === "profile" ? (
        <div className="card-elegant space-y-4">
          {[
            { name: "fullName",    label: "Full Name *",        type: "text",  placeholder: "Your full name" },
            { name: "mobile",      label: "Mobile Number",      type: "tel",   placeholder: "10-digit mobile" },
            { name: "companyName", label: "Company / Property", type: "text",  placeholder: "Your company or property name" },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="label-field">{label}</label>
              <input type={type} className="input-field" placeholder={placeholder} {...profileForm.register(name)} />
              {profileForm.formState.errors[name] && (
                <p className="error-text">{profileForm.formState.errors[name].message}</p>
              )}
            </div>
          ))}

          <div>
            <label className="label-field">Email Address</label>
            <input type="email" className="input-field bg-gray-50 cursor-not-allowed" value={user?.email || ""} disabled />
            <p className="text-gray-400 text-xs mt-1">Email cannot be changed. Contact support if needed.</p>
          </div>

          <div>
            <label className="label-field">Member Since</label>
            <input type="text" className="input-field bg-gray-50 cursor-not-allowed"
              value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : ""}
              disabled
            />
          </div>

          <button onClick={profileForm.handleSubmit(onProfileSave)} disabled={saving}
            className="btn-gold w-full py-3 disabled:opacity-60">
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      ) : (
        <div className="card-elegant space-y-4">
          <p className="text-sm text-gray-500 bg-blue-50 border border-blue-100 rounded-lg p-3">
            💡 Use a strong password with at least 8 characters, including uppercase, number and special character.
          </p>

          {[
            { name: "currentPassword", label: "Current Password *", placeholder: "Your current password" },
            { name: "newPassword",     label: "New Password *",     placeholder: "New strong password" },
            { name: "confirmPassword", label: "Confirm Password *", placeholder: "Repeat new password" },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="label-field">{label}</label>
              <input type="password" className="input-field" placeholder={placeholder} {...pwdForm.register(name)} />
              {pwdForm.formState.errors[name] && (
                <p className="error-text">{pwdForm.formState.errors[name].message}</p>
              )}
            </div>
          ))}

          <button onClick={pwdForm.handleSubmit(onPasswordChange)} disabled={saving}
            className="btn-gold w-full py-3 disabled:opacity-60">
            {saving ? "Changing..." : "Change Password"}
          </button>
        </div>
      )}
    </div>
  );
}
