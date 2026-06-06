import mongoose from "mongoose";

const websiteContentSchema = new mongoose.Schema({
  page:    { type: String, required: true },
  section: { type: String, required: true },
  key:     { type: String, required: true },
  value:   { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });
websiteContentSchema.index({ page: 1, section: 1, key: 1 }, { unique: true });

const notificationSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:   { type: String, required: true },
  message: { type: String, required: true },
  type:    { type: String, enum: ["info","success","warning","error"], default: "info" },
  isRead:  { type: Boolean, default: false },
  link:    { type: String, default: null },
}, { timestamps: true });

const internalMessageSchema = new mongoose.Schema({
  from:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true, trim: true },
  body:    { type: String, required: true },
  isRead:  { type: Boolean, default: false },
}, { timestamps: true });

export const WebsiteContent  = mongoose.model("WebsiteContent", websiteContentSchema);
export const Notification    = mongoose.model("Notification", notificationSchema);
export const InternalMessage = mongoose.model("InternalMessage", internalMessageSchema);
