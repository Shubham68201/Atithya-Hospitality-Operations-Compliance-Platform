import { CareerJob, CareerApplication } from "../models/Career.js";
import { sendApplicationNotifyCompany, sendApplicationConfirmEmail } from "../services/emailService.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";

export const getJobs = async (req, res) => {
  try {
    const { department, type, isActive } = req.query;
    const query = {};
    if (department) query.department = { $regex: department, $options: "i" };
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === "true";
    const jobs = await CareerJob.find(query).sort({ createdAt: -1 });
    return successResponse(res, 200, "Jobs retrieved", { jobs });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const getJobById = async (req, res) => {
  try {
    const job = await CareerJob.findById(req.params.id);
    if (!job) return errorResponse(res, 404, "Job not found");
    return successResponse(res, 200, "Job", { job });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const createJob = async (req, res) => {
  try {
    const job = await CareerJob.create(req.body);
    return successResponse(res, 201, "Job created", { job });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const updateJob = async (req, res) => {
  try {
    const job = await CareerJob.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return errorResponse(res, 404, "Job not found");
    return successResponse(res, 200, "Job updated", { job });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const deleteJob = async (req, res) => {
  try {
    await CareerJob.findByIdAndDelete(req.params.id);
    return successResponse(res, 200, "Job deleted");
  } catch (e) { return errorResponse(res, 500, e.message); }
};

// ── Apply for job ──────────────────────────────────────────────────────
// Accepts multipart/form-data (with optional resume file) OR application/json
export const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Validate job exists
    const job = await CareerJob.findById(jobId);
    if (!job)            return errorResponse(res, 404, "Job not found.");
    if (!job.isActive)   return errorResponse(res, 400, "This position is no longer accepting applications.");

    // Extract fields — works for both multipart and JSON
    const name        = req.body.name;
    const email       = req.body.email;
    const phone       = req.body.phone;
    const coverLetter = req.body.coverLetter || "";

    if (!name || !email || !phone) {
      return errorResponse(res, 400, "Name, email and phone are required.");
    }

    // Duplicate check
    const existing = await CareerApplication.findOne({ job: jobId, email: email.toLowerCase() });
    if (existing) return errorResponse(res, 400, "You have already applied for this position.");

    // Build application data
    const applicationData = {
      job:   jobId,
      name:  name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      coverLetter,
    };

    // Resume URL from Cloudinary upload (req.file.path) or memory fallback
    if (req.file) {
      applicationData.resumeUrl = req.file.path || null;
    }

    const application = await CareerApplication.create(applicationData);

    // Send emails non-blocking
    Promise.all([
      sendApplicationNotifyCompany(application, job.title),
      sendApplicationConfirmEmail(application.email, application.name, job.title),
    ]).catch(console.error);

    return successResponse(res, 201, "Application submitted successfully! We'll be in touch soon.", { application });
  } catch (e) {
    console.error("applyForJob error:", e);
    return errorResponse(res, 500, e.message);
  }
};

export const getApplications = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, jobId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (jobId)  query.job = jobId;
    const total = await CareerApplication.countDocuments(query);
    const applications = await CareerApplication.find(query)
      .populate("job", "title department")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    return paginatedResponse(res, applications, total, page, limit);
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const app = await CareerApplication.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!app) return errorResponse(res, 404, "Application not found");
    return successResponse(res, 200, "Status updated", { application: app });
  } catch (e) { return errorResponse(res, 500, e.message); }
};
