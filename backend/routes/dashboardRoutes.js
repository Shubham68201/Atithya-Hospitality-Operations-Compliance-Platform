import { Router } from "express";
import { getDashboardStats, getChartsData } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = Router();
router.get("/stats",  protect, isAdmin, getDashboardStats);
router.get("/charts", protect, isAdmin, getChartsData);
export default router;
