const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    phone: {
      type: String,
      required: true,
    },

    collegeOrCompany: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: [
        "Student",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "AI/ML Engineer",
      ],
    },

    skills: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
      enum: [
        "Fresher",
        "0-1",
        "1-3",
        "3-5",
        "5+",
      ],
    },

    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Developer", developerSchema);