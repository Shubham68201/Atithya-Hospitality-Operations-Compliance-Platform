import mongoose from "mongoose";

const complianceRecordSchema = new mongoose.Schema({
  property:   { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  title:      { type: String, required: true, trim: true },
  category:   { type: String, enum: ["Fire Safety","Health & Hygiene","Legal & Licensing","Staff Training","Food Safety","Security","Other"], required: true },
  status:     { type: String, enum: ["Compliant","Pending","Overdue","Non-Compliant"], default: "Pending" },
  dueDate:    { type: Date, required: true },
  completedAt:{ type: Date, default: null },
  documents:  [{ name: String, url: String, uploadedAt: { type: Date, default: Date.now } }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  notes:      { type: String },
}, { timestamps: true });

export default mongoose.model("ComplianceRecord", complianceRecordSchema);
