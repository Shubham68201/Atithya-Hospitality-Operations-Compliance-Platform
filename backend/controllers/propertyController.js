import Property from "../models/Property.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";

export const getProperties = async (req, res) => {
  try {
    const { page = 1, limit = 100, type, city, isActive } = req.query;
    const query = {};
    if (type) query.type = type;
    if (city) query.city = { $regex: city, $options: "i" };
    if (isActive !== undefined) query.isActive = isActive === "true";
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query).populate("managedBy","fullName email").sort({ createdAt: -1 }).skip((page-1)*limit).limit(parseInt(limit));
    return paginatedResponse(res, properties, total, page, limit);
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("managedBy","fullName email");
    if (!property) return errorResponse(res, 404, "Property not found");
    return successResponse(res, 200, "Property", { property });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    return successResponse(res, 201, "Property created", { property });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!property) return errorResponse(res, 404, "Property not found");
    return successResponse(res, 200, "Property updated", { property });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    return successResponse(res, 200, "Property deleted");
  } catch (e) { return errorResponse(res, 500, e.message); }
};
