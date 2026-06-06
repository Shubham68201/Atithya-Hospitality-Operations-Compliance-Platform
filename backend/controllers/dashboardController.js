import User from "../models/User.js";
import DemoRequest from "../models/DemoRequest.js";
import { CareerJob, CareerApplication } from "../models/Career.js";
import Property from "../models/Property.js";
import ComplianceRecord from "../models/ComplianceRecord.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, verifiedUsers, pendingVerifications, totalDemos, openDemos, careerApplications, propertiesManaged] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isVerified: false }),
      DemoRequest.countDocuments(),
      DemoRequest.countDocuments({ status: { $in: ["New","Contacted","Qualified"] } }),
      CareerApplication.countDocuments(),
      Property.countDocuments({ isActive: true }),
    ]);
    return successResponse(res, 200, "Stats", { totalUsers, activeUsers, verifiedUsers, pendingVerifications, totalDemos, openDemos, careerApplications, propertiesManaged });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const getChartsData = async (req, res) => {
  try {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth()-11, 1);
    const sixMonthsAgo   = new Date(now.getFullYear(), now.getMonth()-5, 1);
    const [userGrowth, roleDistribution, demoTrend, applicationsByJob, complianceStatus] = await Promise.all([
      User.aggregate([{ $match: { createdAt: { $gte: twelveMonthsAgo } } }, { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } }, { $sort: { "_id.year": 1, "_id.month": 1 } }]),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      DemoRequest.aggregate([{ $match: { createdAt: { $gte: sixMonthsAgo } } }, { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } }, { $sort: { "_id.year": 1, "_id.month": 1 } }]),
      CareerApplication.aggregate([{ $group: { _id: "$job", count: { $sum: 1 } } }, { $lookup: { from: "careerjobs", localField: "_id", foreignField: "_id", as: "job" } }, { $unwind: "$job" }, { $project: { title: "$job.title", count: 1 } }]),
      ComplianceRecord.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);
    return successResponse(res, 200, "Charts data", { userGrowth, roleDistribution, demoTrend, applicationsByJob, complianceStatus });
  } catch (e) { return errorResponse(res, 500, e.message); }
};
