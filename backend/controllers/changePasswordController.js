import User from "../models/User.js";

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: "Current password is incorrect." });
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: "Password changed successfully." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
