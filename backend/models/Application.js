const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    developerId: { type: mongoose.Schema.Types.ObjectId, ref: "Developer", required: true },
    appliedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
