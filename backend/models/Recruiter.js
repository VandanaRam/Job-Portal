// models/Recruiter.js
const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    recruiterName: { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    website:    { type: String, required: true },
    industry:    { type: String, required: true },
    companySize:  { type: String, required: true },
    techStack: { type: String, required: true }, 
 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recruiter", recruiterSchema);