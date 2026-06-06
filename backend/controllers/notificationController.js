import { Notification } from "../models/Content.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    return successResponse(res, 200, "Notifications", { notifications, unreadCount });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    return successResponse(res, 200, "All marked as read");
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    return successResponse(res, 200, "Deleted");
  } catch (e) { return errorResponse(res, 500, e.message); }
};

// Create notification utility (used internally)
export const createNotification = async (userId, title, message, type = "info", link = null) => {
  try {
    await Notification.create({ user: userId, title, message, type, link });
  } catch {}
};
