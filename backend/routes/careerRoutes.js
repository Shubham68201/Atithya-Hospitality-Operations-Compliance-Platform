import { Router } from "express";
import { getJobs, getJobById, createJob, updateJob, deleteJob, applyForJob, getApplications, updateApplicationStatus } from "../controllers/careerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { resumeUpload } from "../middleware/uploadMiddleware.js";

const router = Router();
router.get("/jobs",                    getJobs);
router.get("/jobs/:id",                getJobById);
router.post("/jobs",                   protect, isAdmin, createJob);
router.put("/jobs/:id",                protect, isAdmin, updateJob);
router.delete("/jobs/:id",             protect, isAdmin, deleteJob);
router.post("/apply/:id",              resumeUpload.single("resume"), applyForJob);
router.get("/applications",            protect, isAdmin, getApplications);
router.patch("/applications/:id/status", protect, isAdmin, updateApplicationStatus);
export default router;
