const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  experience: { type: Number, required: true },
  workLocationType: { type: String, enum: ["Remote", "Onsite", "Hybrid"], required: true },
  workLocation: { type: String, required: true },
  jobDescription: { type: String, required: true },
  industryType: { type: String, required: true },
  employmentType: { type: String, required: true },
  education: { type: String, required: true },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: "INR" }
  },
  requiredSkills: [{ type: String }],
  companyLogo: { type: String },
  postedDate: { type: Date, default: Date.now },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Job", JobSchema);
