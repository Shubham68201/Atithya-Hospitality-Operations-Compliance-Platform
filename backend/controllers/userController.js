import User from "../models/User.js";
import { paginatedResponse, successResponse, errorResponse } from "../utils/apiResponse.js";

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, isActive, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (search) query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } },
    ];
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip((page-1)*limit).limit(parseInt(limit));
    return paginatedResponse(res, users, total, page, limit);
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, "User not found");
    return successResponse(res, 200, "User retrieved", { user });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, "User not found");
    if (user.role === "super_admin" && req.user.role !== "super_admin") return errorResponse(res, 403, "Cannot modify Super Admin.");
    user.role = role;
    await user.save();
    return successResponse(res, 200, "Role updated", { user });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, "User not found");
    if (user.role === "super_admin") return errorResponse(res, 403, "Cannot suspend Super Admin.");
    user.isActive = !user.isActive;
    await user.save();
    return successResponse(res, 200, `User ${user.isActive ? "activated" : "suspended"}`, { user });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, "User not found");
    if (user.role === "super_admin") return errorResponse(res, 403, "Cannot delete Super Admin.");
    if (user._id.toString() === req.user._id.toString()) return errorResponse(res, 403, "Cannot delete yourself.");
    await user.deleteOne();
    return successResponse(res, 200, "User deleted");
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, mobile, companyName, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { fullName, mobile, companyName, ...(avatar && { avatar }) }, { new: true, runValidators: true });
    return successResponse(res, 200, "Profile updated", { user });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

// Staff list for messaging (all staff roles)
export const getStaffList = async (req, res) => {
  try {
    const staffRoles = ["super_admin","admin","operations_manager","compliance_manager","staff"];
    const users = await User.find({ role: { $in: staffRoles }, isActive: true, _id: { $ne: req.user._id } })
      .select("fullName email role companyName").sort({ fullName: 1 });
    return successResponse(res, 200, "Staff list", { users });
  } catch (e) { return errorResponse(res, 500, e.message); }
};
