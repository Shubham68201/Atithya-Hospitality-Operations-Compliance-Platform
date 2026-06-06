import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  type:          { type: String, enum: ["Hotel","Resort","Guest House","Hostel","Service Apartment","Other"], required: true },
  address:       { type: String, required: true },
  city:          { type: String, required: true },
  state:         { type: String, required: true },
  totalRooms:    { type: Number, required: true, min: 1 },
  contactPerson: { type: String, required: true },
  contactPhone:  { type: String },
  contactEmail:  { type: String, lowercase: true },
  isActive:      { type: Boolean, default: true },
  managedBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

export default mongoose.model("Property", propertySchema);
