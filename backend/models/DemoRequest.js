import mongoose from "mongoose";

const demoRequestSchema = new mongoose.Schema({
  companyName:        { type: String, required: true, trim: true },
  contactPerson:      { type: String, required: true, trim: true },
  email:              { type: String, required: true, lowercase: true },
  phone:              { type: String, required: true },
  propertyType:       { type: String, enum: ["Hotel","Resort","Guest House","Hostel","Service Apartment","Other"], required: true },
  numberOfProperties: { type: Number, required: true, min: 1 },
  message:            { type: String, trim: true },
  status: {
    type: String,
    enum: ["New","Contacted","Qualified","Demo Scheduled","Converted","Closed"],
    default: "New",
  },
  notes: [{
    text:    { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    addedAt: { type: Date, default: Date.now },
  }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

export default mongoose.model("DemoRequest", demoRequestSchema);
