import { Router } from "express";
import { getUsers, getUser, updateUserRole, toggleUserStatus, deleteUser, updateProfile, getStaffList } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin, isSuperAdmin } from "../middleware/roleMiddleware.js";

const router = Router();
router.get("/",              protect, isAdmin, getUsers);
router.get("/staff",         protect, getStaffList);
router.get("/:id",           protect, isAdmin, getUser);
router.patch("/:id/role",    protect, isSuperAdmin, updateUserRole);
router.patch("/:id/status",  protect, isAdmin, toggleUserStatus);
router.delete("/:id",        protect, isSuperAdmin, deleteUser);
router.put("/profile",       protect, updateProfile);
export default router;
