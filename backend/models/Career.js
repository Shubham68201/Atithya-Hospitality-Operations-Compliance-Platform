import mongoose from "mongoose";

const careerJobSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  department:  { type: String, required: true, trim: true },
  location:    { type: String, required: true, trim: true },
  type:        { type: String, enum: ["Full-Time","Part-Time","Contract","Internship","Freelance"], required: true },
  experience:  { type: String, required: true },
  description: { type: String, required: true },
  requirements:[{ type: String }],
  salary:      { type: String },
  deadline:    { type: Date },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

const careerApplicationSchema = new mongoose.Schema({
  job:         { type: mongoose.Schema.Types.ObjectId, ref: "CareerJob", required: true },
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true },
  phone:       { type: String, required: true },
  resumeUrl:   { type: String },
  coverLetter: { type: String },
  status: {
    type: String,
    enum: ["Applied","Reviewing","Shortlisted","Interview","Hired","Rejected"],
    default: "Applied",
  },
}, { timestamps: true });

export const CareerJob         = mongoose.model("CareerJob", careerJobSchema);
export const CareerApplication = mongoose.model("CareerApplication", careerApplicationSchema);
