import ComplianceRecord from "../models/ComplianceRecord.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/apiResponse.js";

export const getRecords = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category, property } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (property) query.property = property;
    const total = await ComplianceRecord.countDocuments(query);
    const records = await ComplianceRecord.find(query)
      .populate("property", "name city")
      .populate("assignedTo", "fullName email")
      .sort({ dueDate: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    return paginatedResponse(res, records, total, page, limit);
  } catch (e) {
    return errorResponse(res, 500, e.message);
  }
};

export const getRecord = async (req, res) => {
  try {
    const record = await ComplianceRecord.findById(req.params.id)
      .populate("property", "name city")
      .populate("assignedTo", "fullName email");
    if (!record) return errorResponse(res, 404, "Record not found");
    return successResponse(res, 200, "Record", { record });
  } catch (e) {
    return errorResponse(res, 500, e.message);
  }
};

export const createRecord = async (req, res) => {
  try {
    const { property, title, category, status, dueDate, notes } = req.body;

    if (!property) return errorResponse(res, 400, "Property is required.");
    if (!title) return errorResponse(res, 400, "Title is required.");
    if (!dueDate) return errorResponse(res, 400, "Due date is required.");

    const recordData = { property, title, category, status, dueDate, notes };

    // Handle documents uploaded during creation (multipart)
    if (req.files && req.files.length > 0) {
      recordData.documents = req.files.map((f) => ({
        name: f.originalname || f.filename || "document",
        url: f.secure_url || f.path || f.url || "",
      }));
    }

    const record = await ComplianceRecord.create(recordData);
    const populated = await ComplianceRecord.findById(record._id).populate(
      "property",
      "name city",
    );
    return successResponse(res, 201, "Record created", { record: populated });
  } catch (e) {
    console.error("createRecord error:", e);
    return errorResponse(res, 500, e.message);
  }
};

export const updateRecord = async (req, res) => {
  try {
    const record = await ComplianceRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    ).populate("property", "name city");
    if (!record) return errorResponse(res, 404, "Record not found");
    return successResponse(res, 200, "Record updated", { record });
  } catch (e) {
    return errorResponse(res, 500, e.message);
  }
};

export const updateRecordStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updates = { status };
    if (status === "Compliant") updates.completedAt = new Date();
    const record = await ComplianceRecord.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true },
    );
    if (!record) return errorResponse(res, 404, "Record not found");
    return successResponse(res, 200, "Status updated", { record });
  } catch (e) {
    return errorResponse(res, 500, e.message);
  }
};

export const deleteRecord = async (req, res) => {
  try {
    await ComplianceRecord.findByIdAndDelete(req.params.id);
    return successResponse(res, 200, "Record deleted");
  } catch (e) {
    return errorResponse(res, 500, e.message);
  }
};

// Upload documents to an existing compliance record
export const uploadDocument = async (req, res) => {
  try {
    const record = await ComplianceRecord.findById(req.params.id);
    if (!record) return errorResponse(res, 404, "Record not found");

    if (!req.file && (!req.files || req.files.length === 0)) {
      return errorResponse(res, 400, "No file uploaded.");
    }

    const files = req.files || (req.file ? [req.file] : []);
    const newDocs = files.map((f) => ({
      name: f.originalname || f.filename || "document",
      url: f.secure_url || f.path || f.url || "",
    }));

    record.documents.push(...newDocs);
    await record.save();

    const updated = await ComplianceRecord.findById(record._id).populate(
      "property",
      "name city",
    );
    return successResponse(res, 200, "Document(s) uploaded", {
      record: updated,
    });
  } catch (e) {
    console.error("uploadDocument error:", e);
    return errorResponse(res, 500, e.message);
  }
};
