import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName:    { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobile:      { type: String, trim: true },
  companyName: { type: String, trim: true },
  password:    { type: String, required: true, minlength: 8, select: false },
  role: {
    type: String,
    enum: ["super_admin","admin","operations_manager","compliance_manager","staff","customer"],
    default: "customer",
  },
  isVerified: { type: Boolean, default: false },
  isActive:   { type: Boolean, default: true },
  avatar:     { type: String, default: null },
  lastLogin:  { type: Date,   default: null },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
