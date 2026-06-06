import { Router } from "express";
import { getProperties, getProperty, createProperty, updateProperty, deleteProperty } from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isOperations, authorize } from "../middleware/roleMiddleware.js";

const router = Router();

// All staff roles can READ properties (for dropdowns in compliance etc.)
const canReadProperties = authorize(
  "super_admin", "admin", "operations_manager", "compliance_manager", "staff"
);

router.get("/",      protect, canReadProperties, getProperties);
router.get("/:id",   protect, canReadProperties, getProperty);

// Only operations+ can write
router.post("/",     protect, isOperations, createProperty);
router.put("/:id",   protect, isOperations, updateProperty);
router.delete("/:id",protect, isOperations, deleteProperty);

export default router;
