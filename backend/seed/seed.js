import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

import User            from "../models/User.js";
import { CareerJob, CareerApplication } from "../models/Career.js";
import DemoRequest     from "../models/DemoRequest.js";
import Property        from "../models/Property.js";
import ComplianceRecord from "../models/ComplianceRecord.js";
import ContactMessage  from "../models/ContactMessage.js";
import { WebsiteContent } from "../models/Content.js";

const SEED_USERS = [
  { fullName:"Samriddhi Agrawal",  email:"superadmin@atithya.in",  password:"Sp3r!A#9kXmN2@qZ",  role:"super_admin",         mobile:"9876543210", companyName:"Shri Perumal Hospitality Innovations Pvt. Ltd.", isVerified:true },
  { fullName:"Arjun Sharma",       email:"admin@atithya.in",       password:"Adm!nS#4rMa$7tY2",  role:"admin",               mobile:"9876543211", companyName:"Shri Perumal Hospitality Innovations Pvt. Ltd.", isVerified:true },
  { fullName:"Priya Nair",         email:"operations@atithya.in",  password:"0pZ#Nair$3mQ!7vXr", role:"operations_manager",  mobile:"9876543212", companyName:"Shri Perumal Hospitality Innovations Pvt. Ltd.", isVerified:true },
  { fullName:"Vikram Mehta",       email:"compliance@atithya.in",  password:"C0mpl!M3hta#9Xv$k", role:"compliance_manager",  mobile:"9876543213", companyName:"Shri Perumal Hospitality Innovations Pvt. Ltd.", isVerified:true },
  { fullName:"Kavitha Reddy",      email:"staff@atithya.in",       password:"St@ff!K4v#9Rd$2mZ", role:"staff",               mobile:"9876543214", companyName:"Shri Perumal Hospitality Innovations Pvt. Ltd.", isVerified:true },
  { fullName:"Rajan Pillai",       email:"customer@atithya.in",    password:"Cu$t0!R4jan#7Pl2X", role:"customer",            mobile:"9876543215", companyName:"Pillai Hotels & Resorts",                        isVerified:true },
  { fullName:"Meena Krishnaswamy", email:"meena.k@hotelier.com",   password:"M3ena!Kr!5#9Qz$Xv", role:"customer",            mobile:"9823456789", companyName:"Krishnaswamy Hospitality Group",                 isVerified:false },
  { fullName:"Deepak Bansal",      email:"deepak.b@resorts.com",   password:"D33p@k!B4ns#7Xm$Q", role:"customer",            mobile:"9812345678", companyName:"Bansal Resorts & Retreats",                      isVerified:true },
];

await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/atithya_db");
console.log("✅ Connected to MongoDB");

await Promise.all([User.deleteMany(),CareerJob.deleteMany(),CareerApplication.deleteMany(),DemoRequest.deleteMany(),Property.deleteMany(),ComplianceRecord.deleteMany(),ContactMessage.deleteMany(),WebsiteContent.deleteMany()]);
console.log("🧹 Cleared all collections");

const createdUsers = [];
for (const u of SEED_USERS) {
  const hashed = await bcrypt.hash(u.password, 12);
  createdUsers.push(await User.create({ ...u, password: hashed }));
}
console.log(`👥 Seeded ${createdUsers.length} users`);

const opManager = createdUsers.find(u => u.role === "operations_manager");
const complianceManager = createdUsers.find(u => u.role === "compliance_manager");

const properties = await Property.insertMany([
  { name:"The Grand Maratha Mumbai",   type:"Hotel",       city:"Mumbai",    state:"Maharashtra",     totalRooms:250, address:"Sahar Airport Road, Andheri East", contactPerson:"Rajesh Kulkarni",  contactPhone:"9911223344", managedBy:opManager._id },
  { name:"Rajputana Regal Resort",     type:"Resort",      city:"Jaipur",    state:"Rajasthan",       totalRooms:120, address:"Civil Lines, Jaipur",              contactPerson:"Sunita Rathore",   contactPhone:"9922334455", managedBy:opManager._id },
  { name:"Heritage Haveli Udaipur",    type:"Guest House", city:"Udaipur",   state:"Rajasthan",       totalRooms:45,  address:"City Palace Road, Udaipur",        contactPerson:"Amarjeet Singh",   contactPhone:"9933445566" },
  { name:"Southern Comfort Boutique",  type:"Hotel",       city:"Bengaluru", state:"Karnataka",       totalRooms:80,  address:"Indiranagar, Bengaluru",           contactPerson:"Lakshmi Menon",    contactPhone:"9944556677" },
  { name:"Himalayan Retreats Manali",  type:"Resort",      city:"Manali",    state:"Himachal Pradesh",totalRooms:60,  address:"Old Manali Road, Manali",          contactPerson:"Gurpreet Chauhan", contactPhone:"9955667788" },
]);
console.log(`🏨 Seeded ${properties.length} properties`);

await CareerJob.insertMany([
  { title:"Full Stack Developer",           department:"Engineering",          location:"Varanasi, UP (Hybrid)", type:"Full-Time",  experience:"2-4 years",  salary:"₹6L–₹12L p.a.",           description:"Build and maintain Atithya platform using MERN stack.", requirements:["React","Node.js","MongoDB","REST APIs"],isActive:true },
  { title:"Business Development Executive", department:"Sales & Partnerships", location:"Mumbai/Delhi (Field)",  type:"Full-Time",  experience:"1-3 years",  salary:"₹4L–₹8L + Incentives",    description:"Drive hotel & resort partnerships for Atithya.",         requirements:["B2B Sales","Hospitality","CRM"],       isActive:true },
  { title:"UX/UI Designer",                 department:"Design",               location:"Remote",                type:"Full-Time",  experience:"2-3 years",  salary:"₹5L–₹9L p.a.",            description:"Design intuitive interfaces for Atithya platform.",      requirements:["Figma","Adobe XD","Prototyping"],      isActive:true },
  { title:"Marketing & Content Intern",     department:"Marketing",            location:"Varanasi (On-site)",    type:"Internship", experience:"0-1 years",  salary:"₹8K–₹12K/month",          description:"Create content for social media, blog, and marketing.",  requirements:["Content Writing","Canva","SEO"],        isActive:true },
]);
console.log("💼 Seeded jobs");

await DemoRequest.insertMany([
  { companyName:"Taj Hotels Group",          contactPerson:"Rohan Mehrotra", email:"rohan.m@tajhotels.com",   phone:"9811223344", propertyType:"Hotel",       numberOfProperties:12, status:"Demo Scheduled" },
  { companyName:"Mountain View Resorts",     contactPerson:"Aarti Sharma",   email:"aarti@mvresorts.com",    phone:"9822334455", propertyType:"Resort",      numberOfProperties:3,  status:"Qualified"      },
  { companyName:"Urban Stay Guest Houses",   contactPerson:"Suresh Pillai",  email:"suresh@urbanstay.in",    phone:"9833445566", propertyType:"Guest House", numberOfProperties:8,  status:"New"            },
  { companyName:"Seashore Hospitality",      contactPerson:"Kiran Das",      email:"kiran@seashore.in",      phone:"9855667788", propertyType:"Resort",      numberOfProperties:5,  status:"Converted"      },
]);
console.log("📋 Seeded demo requests");

await ComplianceRecord.insertMany([
  { property:properties[0]._id, title:"Annual Fire Safety Audit",     category:"Fire Safety",       status:"Compliant",     dueDate:new Date("2025-03-31"), completedAt:new Date("2025-03-15"), assignedTo:complianceManager._id },
  { property:properties[0]._id, title:"Kitchen Hygiene Certification", category:"Food Safety",       status:"Pending",       dueDate:new Date("2025-07-15"), assignedTo:complianceManager._id },
  { property:properties[1]._id, title:"FSSAI License Renewal",         category:"Legal & Licensing", status:"Overdue",       dueDate:new Date("2025-05-01"), assignedTo:complianceManager._id },
  { property:properties[2]._id, title:"Guest House Registration",       category:"Legal & Licensing", status:"Pending",       dueDate:new Date("2025-08-31"), assignedTo:complianceManager._id },
  { property:properties[3]._id, title:"CCTV & Security Audit",          category:"Security",          status:"Non-Compliant", dueDate:new Date("2025-06-15"), assignedTo:complianceManager._id },
  { property:properties[4]._id, title:"Health & Sanitation Inspection", category:"Health & Hygiene",  status:"Compliant",     dueDate:new Date("2025-05-31"), completedAt:new Date("2025-05-28"), assignedTo:complianceManager._id },
]);
console.log("✅ Seeded compliance records");

await ContactMessage.insertMany([
  { name:"Harpreet Kaur",  email:"harpreet@hotmail.com", phone:"9812345678", subject:"Partnership Enquiry",    message:"We run a chain of Punjabi dhaba-style hotels.", isReplied:false },
  { name:"Sanjay Bhatt",   email:"sbhatt@mountain.in",   phone:"9856781234", subject:"Compliance Module Query", message:"How does compliance handle mountain resorts?",  isReplied:false },
  { name:"Divya Thomas",   email:"d.thomas@btravels.com",phone:"9934567890", subject:"Pricing Request",         message:"Could you send the pricing brochure?",          isReplied:false },
]);
console.log("📩 Seeded contact messages");

await WebsiteContent.insertMany([
  { page:"home",   section:"hero",    key:"headline",    value:"Check In Se Compliance Tak" },
  { page:"home",   section:"hero",    key:"subheadline", value:"Sab Automatic" },
  { page:"home",   section:"stats",   key:"hotels",      value:"500+" },
  { page:"home",   section:"stats",   key:"compliance",  value:"98%" },
  { page:"home",   section:"stats",   key:"cities",      value:"25+" },
  { page:"about",  section:"company", key:"story",       value:"Founded at AIC-MFIE-IMS-BHU, Varanasi." },
  { page:"contact",section:"info",    key:"email",       value:"sriperumal.aperio@gmail.com" },
  { page:"contact",section:"info",    key:"phone",       value:"+91 8828273581" },
]);
console.log("📝 Seeded content");

console.log("\n" + "═".repeat(72));
console.log("  ATITHYA SEED CREDENTIALS — SAVE SECURELY");
console.log("═".repeat(72));
SEED_USERS.filter(u => u.companyName.includes("Shri Perumal")).forEach(u =>
  console.log(`  ${u.role.padEnd(22)} ${u.email.padEnd(34)} ${u.password}`)
);
console.log("═".repeat(72) + "\n");

await mongoose.disconnect();
process.exit(0);
