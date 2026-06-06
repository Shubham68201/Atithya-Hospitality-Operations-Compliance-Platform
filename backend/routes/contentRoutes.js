import { Router } from "express";
import { getContent, updateContent } from "../controllers/contentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = Router();
router.get("/", getContent);
router.put("/:page/:section/:key", protect, isAdmin, updateContent);
export default router;
