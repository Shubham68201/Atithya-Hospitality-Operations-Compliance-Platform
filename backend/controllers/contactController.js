import ContactMessage from "../models/ContactMessage.js";
import { sendContactReplyEmail, sendContactNotifyCompany } from "../services/emailService.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";

export const createContact = async (req, res) => {
  try {
    const message = await ContactMessage.create(req.body);
    sendContactNotifyCompany(message).catch(console.error);
    return successResponse(res, 201, "Message sent successfully", { message });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, isReplied } = req.query;
    const query = {};
    if (isReplied !== undefined) query.isReplied = isReplied === "true";
    const total = await ContactMessage.countDocuments(query);
    const messages = await ContactMessage.find(query).sort({ createdAt: -1 }).skip((page-1)*limit).limit(parseInt(limit));
    return paginatedResponse(res, messages, total, page, limit);
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const replyContact = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    if (!replyMessage || !replyMessage.trim()) return errorResponse(res, 400, "Reply message is required.");
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isReplied: true, replyMessage, repliedAt: new Date(), repliedBy: req.user._id },
      { new: true }
    );
    if (!message) return errorResponse(res, 404, "Message not found");
    // Send reply email to original sender
    await sendContactReplyEmail(message.email, message.name, message.subject, replyMessage);
    return successResponse(res, 200, "Reply sent via email", { message });
  } catch (e) {
    console.error("Reply error:", e);
    return errorResponse(res, 500, e.message);
  }
};

export const deleteContact = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    return successResponse(res, 200, "Message deleted");
  } catch (e) { return errorResponse(res, 500, e.message); }
};
