import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

/**
 * Creates a Cloudinary storage instance.
 * type: "upload"  → PUBLIC access (no signed URL needed)
 * access_mode: "public" → explicitly marks asset as public
 */
const createStorage = (folder, resourceType = "auto") =>
  new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder:         `atithya/${folder}`,
      resource_type:  resourceType,
      type:           "upload",          // PUBLIC delivery (not "authenticated")
      access_mode:    "public",          // ensures public access
      // Use original filename (sanitised) as the public_id
      public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
    }),
  });

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY    &&
  process.env.CLOUDINARY_API_SECRET;

/** Build a multer instance that uploads to Cloudinary, with memory fallback for dev */
const makeUpload = (folder, allowedMimes, maxSizeBytes, resourceType = "auto") => {
  const fileFilter = (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) return cb(null, true);
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${allowedMimes.join(", ")}`));
  };

  if (isCloudinaryConfigured) {
    return multer({
      storage:    createStorage(folder, resourceType),
      limits:     { fileSize: maxSizeBytes },
      fileFilter,
    });
  }

  // Dev fallback: memory storage (files won't be persisted, but no crash)
  console.warn(`⚠  Cloudinary not configured — using memory storage for ${folder}`);
  return multer({
    storage:    multer.memoryStorage(),
    limits:     { fileSize: maxSizeBytes },
    fileFilter,
  });
};

// Avatar: images only
export const avatarUpload = makeUpload(
  "avatars",
  ["image/jpeg","image/jpg","image/png","image/webp"],
  2 * 1024 * 1024,
  "image"
);

// Resume: documents only
export const resumeUpload = makeUpload(
  "resumes",
  ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  5 * 1024 * 1024,
  "raw"          // "raw" for non-image/non-video files (PDF, DOC)
);

// Compliance docs: PDF + images
export const documentUpload = makeUpload(
  "compliance-docs",
  ["application/pdf","image/jpeg","image/jpg","image/png"],
  10 * 1024 * 1024,
  "auto"         // auto-detects image vs raw
);
