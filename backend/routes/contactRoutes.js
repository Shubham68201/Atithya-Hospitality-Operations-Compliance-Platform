import { Router } from "express";
import { createContact, getContacts, replyContact, deleteContact } from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = Router();
router.post("/",           createContact);
router.get("/",            protect, isAdmin, getContacts);
router.post("/:id/reply",  protect, isAdmin, replyContact);
router.delete("/:id",      protect, isAdmin, deleteContact);
export default router;
