import { Router } from "express";
import { sendMessage, getInbox, getSent, markMessageRead, deleteMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/",              protect, sendMessage);
router.get("/inbox",          protect, getInbox);
router.get("/sent",           protect, getSent);
router.patch("/:id/read",     protect, markMessageRead);
router.delete("/:id",         protect, deleteMessage);
export default router;
