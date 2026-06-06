import DemoRequest from "../models/DemoRequest.js";
import { sendDemoConfirmationEmail, sendDemoNotifyCompany } from "../services/emailService.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";

export const createDemo = async (req, res) => {
  try {
    const demo = await DemoRequest.create(req.body);
    Promise.all([
      sendDemoConfirmationEmail(demo.email, demo.companyName),
      sendDemoNotifyCompany(demo),
    ]).catch(console.error);
    return successResponse(res, 201, "Demo request submitted successfully!", { demo });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const getDemos = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.$or = [
      { companyName:   { $regex: search, $options: "i" } },
      { contactPerson: { $regex: search, $options: "i" } },
      { email:         { $regex: search, $options: "i" } },
    ];
    const total = await DemoRequest.countDocuments(query);
    const demos = await DemoRequest.find(query)
      .populate("assignedTo", "fullName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    return paginatedResponse(res, demos, total, page, limit);
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const getDemoById = async (req, res) => {
  try {
    const demo = await DemoRequest.findById(req.params.id).populate("assignedTo", "fullName email");
    if (!demo) return errorResponse(res, 404, "Demo not found");
    return successResponse(res, 200, "Demo retrieved", { demo });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const updateDemoStatus = async (req, res) => {
  try {
    const demo = await DemoRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!demo) return errorResponse(res, 404, "Demo not found");
    return successResponse(res, 200, "Status updated", { demo });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const addDemoNote = async (req, res) => {
  try {
    const demo = await DemoRequest.findById(req.params.id);
    if (!demo) return errorResponse(res, 404, "Demo not found");
    demo.notes.push({ text: req.body.text, addedBy: req.user._id });
    await demo.save();
    return successResponse(res, 200, "Note added", { demo });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const deleteDemo = async (req, res) => {
  try {
    await DemoRequest.findByIdAndDelete(req.params.id);
    return successResponse(res, 200, "Demo deleted");
  } catch (e) { return errorResponse(res, 500, e.message); }
};

// Customer portal: get demos matching their registered email
// This works because demo submissions use email as the identifier
export const getMyDemos = async (req, res) => {
  try {
    // Match by the logged-in user's email (case-insensitive)
    const email = req.user.email.toLowerCase().trim();
    const demos = await DemoRequest.find({ email })
      .sort({ createdAt: -1 })
      .select("-notes -assignedTo"); // hide internal notes from customer
    return successResponse(res, 200, "Your demo requests", { demos });
  } catch (e) { return errorResponse(res, 500, e.message); }
};
