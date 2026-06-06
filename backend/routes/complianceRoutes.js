import { Router } from "express";
import {
  getRecords, getRecord, createRecord, updateRecord,
  updateRecordStatus, deleteRecord, uploadDocument,
} from "../controllers/complianceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isCompliance } from "../middleware/roleMiddleware.js";
import { documentUpload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/",              protect, isCompliance, getRecords);
router.get("/:id",           protect, isCompliance, getRecord);

// POST /compliance — accepts multipart with optional documents[] files
router.post("/",             protect, isCompliance, documentUpload.array("documents", 5), createRecord);

router.put("/:id",           protect, isCompliance, updateRecord);
router.patch("/:id/status",  protect, isCompliance, updateRecordStatus);
router.delete("/:id",        protect, isCompliance, deleteRecord);

// POST /compliance/:id/documents — upload more docs to existing record
router.post("/:id/documents",protect, isCompliance, documentUpload.array("documents", 5), uploadDocument);

export default router;
