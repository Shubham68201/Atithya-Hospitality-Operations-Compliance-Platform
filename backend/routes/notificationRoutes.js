import { Router } from "express";
import { getMyNotifications, markAsRead, deleteNotification } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/",            protect, getMyNotifications);
router.patch("/read-all",  protect, markAsRead);
router.delete("/:id",      protect, deleteNotification);
export default router;
