import { Router } from "express";
import { createDemo, getDemos, getDemoById, updateDemoStatus, addDemoNote, deleteDemo, getMyDemos } from "../controllers/demoController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = Router();
router.post("/",             createDemo);
router.get("/my",            protect, getMyDemos);
router.get("/",              protect, isAdmin, getDemos);
router.get("/:id",           protect, isAdmin, getDemoById);
router.patch("/:id/status",  protect, isAdmin, updateDemoStatus);
router.post("/:id/notes",    protect, isAdmin, addDemoNote);
router.delete("/:id",        protect, isAdmin, deleteDemo);
export default router;
