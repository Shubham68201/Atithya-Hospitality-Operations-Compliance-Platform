import { InternalMessage, Notification } from "../models/Content.js";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const STAFF_ROLES = ["super_admin","admin","operations_manager","compliance_manager","staff"];

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    if (!STAFF_ROLES.includes(req.user.role)) return errorResponse(res, 403, "Only staff can send internal messages.");
    const recipient = await User.findById(to);
    if (!recipient) return errorResponse(res, 404, "Recipient not found");
    if (!STAFF_ROLES.includes(recipient.role)) return errorResponse(res, 400, "Can only message staff members.");
    const msg = await InternalMessage.create({ from: req.user._id, to, subject, body });
    // Create notification for recipient
    await Notification.create({
      user: to,
      title: `New message from ${req.user.fullName}`,
      message: subject,
      type: "info",
      link: "/admin/messages/inbox",
    });
    return successResponse(res, 201, "Message sent", { message: msg });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

// Get inbox
export const getInbox = async (req, res) => {
  try {
    const messages = await InternalMessage.find({ to: req.user._id })
      .populate("from","fullName email role")
      .sort({ createdAt: -1 });
    const unreadCount = messages.filter(m => !m.isRead).length;
    return successResponse(res, 200, "Inbox", { messages, unreadCount });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

// Get sent
export const getSent = async (req, res) => {
  try {
    const messages = await InternalMessage.find({ from: req.user._id })
      .populate("to","fullName email role")
      .sort({ createdAt: -1 });
    return successResponse(res, 200, "Sent messages", { messages });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

// Mark message as read
export const markMessageRead = async (req, res) => {
  try {
    await InternalMessage.findOneAndUpdate({ _id: req.params.id, to: req.user._id }, { isRead: true });
    return successResponse(res, 200, "Marked as read");
  } catch (e) { return errorResponse(res, 500, e.message); }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    await InternalMessage.findOneAndDelete({ _id: req.params.id, $or: [{ from: req.user._id }, { to: req.user._id }] });
    return successResponse(res, 200, "Deleted");
  } catch (e) { return errorResponse(res, 500, e.message); }
};
