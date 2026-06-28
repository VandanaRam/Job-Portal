const express = require("express");
const { authenticateToken, requireRole } = require("../middleware/auth");
const Job = require("../models/Job");
const Application = require("../models/Application");

const router = express.Router();

// Get all jobs with filtering and pagination (Public or Authenticated)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 6, search = "", experience = "", location = "", type = "" } = req.query;

    let query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { requiredSkills: { $regex: search, $options: "i" } }
      ];
    }

    if (experience) {
      const expYears = parseInt(experience);
      query.experience = { $lte: expYears };
    }

    if (location) {
      query.workLocation = { $regex: location, $options: "i" };
    }

    if (type) {
      query.workLocationType = { $regex: `^${type}$`, $options: "i" };
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 6;
    const startIndex = (pageNum - 1) * limitNum;

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .skip(startIndex)
      .limit(limitNum)
      .sort({ postedDate: -1 });

    const totalPages = Math.ceil(totalJobs / limitNum);

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalJobs,
        jobsPerPage: limitNum
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get job stats summary overview
router.get("/stats/overview", async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true });
    
    // Calculate total applications across all jobs
    const totalApps = await Application.countDocuments();

    // Unique values
    const locations = [...new Set(jobs.map(job => job.workLocation))];
    const workTypes = [...new Set(jobs.map(job => job.workLocationType))];

    // Average salary
    let totalSalarySum = 0;
    let salaryCount = 0;
    jobs.forEach(job => {
      if (job.salary && (job.salary.min || job.salary.max)) {
        const min = job.salary.min || 0;
        const max = job.salary.max || 0;
        totalSalarySum += (min + max) / 2;
        salaryCount++;
      }
    });

    const averageSalary = salaryCount ? Math.round(totalSalarySum / salaryCount) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalJobs: jobs.length,
        totalApplications: totalApps,
        averageSalary,
        industryTypes: [...new Set(jobs.map(job => job.industryType))].length,
        locations,
        workTypes
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get applications of the logged-in developer
router.get("/developer/applications", authenticateToken, requireRole("developer"), async (req, res) => {
  try {
    const developerId = req.user.id;
    const applications = await Application.find({ developerId })
      .populate("jobId")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all jobs posted by the logged-in recruiter
router.get("/recruiter/jobs", authenticateToken, requireRole("recruiter"), async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobs = await Job.find({ postedBy: recruiterId }).sort({ postedDate: -1 });

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ jobId: job._id });
        return {
          ...job.toObject(),
          applications: count
        };
      })
    );

    res.status(200).json({ success: true, data: jobsWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get list of applicants for a recruiter's job
router.get("/:id/applicants", authenticateToken, requireRole("recruiter"), async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiterId = req.user.id;

    // Verify job belongs to this recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    if (job.postedBy.toString() !== recruiterId) {
      return res.status(403).json({ success: false, message: "Unauthorized access to job applicants" });
    }

    const applications = await Application.find({ jobId })
      .populate("developerId", "fullName email phone collegeOrCompany role skills experience linkedin github")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single job details
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Post a new job (Recruiter only)
router.post("/", authenticateToken, requireRole("recruiter"), async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const {
      title,
      company,
      experience,
      workLocationType,
      workLocation,
      jobDescription,
      industryType,
      employmentType,
      education,
      salary,
      requiredSkills,
      companyLogo
    } = req.body;

    const parsedSkills = Array.isArray(requiredSkills)
      ? requiredSkills
      : requiredSkills
      ? requiredSkills.split(",").map(skill => skill.trim()).filter(Boolean)
      : [];

    const newJob = new Job({
      title,
      company,
      experience: parseInt(experience) || 0,
      workLocationType,
      workLocation,
      jobDescription,
      industryType,
      employmentType,
      education,
      salary: {
        min: salary?.min ? parseInt(salary.min) : undefined,
        max: salary?.max ? parseInt(salary.max) : undefined,
        currency: salary?.currency || "INR"
      },
      requiredSkills: parsedSkills,
      companyLogo: companyLogo || "",
      postedBy: recruiterId
    });

    await newJob.save();
    res.status(201).json({ success: true, message: "Job posted successfully", data: newJob });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Apply to a job (Developer only)
router.post("/:id/apply", authenticateToken, requireRole("developer"), async (req, res) => {
  try {
    const jobId = req.params.id;
    const developerId = req.user.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if already applied
    const existing = await Application.findOne({ jobId, developerId });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already applied for this job." });
    }

    const application = new Application({
      jobId,
      developerId
    });

    await application.save();

    res.status(201).json({ success: true, message: "Applied successfully", data: application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update job details (Recruiter only)
router.put("/:id", authenticateToken, requireRole("recruiter"), async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiterId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.postedBy.toString() !== recruiterId) {
      return res.status(403).json({ success: false, message: "Unauthorized to edit this job" });
    }

    const {
      title,
      company,
      experience,
      workLocationType,
      workLocation,
      jobDescription,
      industryType,
      employmentType,
      education,
      salary,
      requiredSkills,
      companyLogo,
      isActive
    } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (company !== undefined) updates.company = company;
    if (experience !== undefined) updates.experience = parseInt(experience) || 0;
    if (workLocationType !== undefined) updates.workLocationType = workLocationType;
    if (workLocation !== undefined) updates.workLocation = workLocation;
    if (jobDescription !== undefined) updates.jobDescription = jobDescription;
    if (industryType !== undefined) updates.industryType = industryType;
    if (employmentType !== undefined) updates.employmentType = employmentType;
    if (education !== undefined) updates.education = education;
    if (companyLogo !== undefined) updates.companyLogo = companyLogo;
    if (isActive !== undefined) updates.isActive = isActive;

    if (salary !== undefined) {
      updates.salary = {
        min: salary?.min ? parseInt(salary.min) : undefined,
        max: salary?.max ? parseInt(salary.max) : undefined,
        currency: salary?.currency || "INR"
      };
    }

    if (requiredSkills !== undefined) {
      updates.requiredSkills = Array.isArray(requiredSkills)
        ? requiredSkills
        : requiredSkills.split(",").map(skill => skill.trim()).filter(Boolean);
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updates, { new: true });
    res.status(200).json({ success: true, message: "Job updated successfully", data: updatedJob });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete/Deactivate job listing (Recruiter only)
router.delete("/:id", authenticateToken, requireRole("recruiter"), async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiterId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.postedBy.toString() !== recruiterId) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this job" });
    }

    // We can do hard delete or soft delete (setting isActive to false). Let's do a hard delete as requested
    await Job.findByIdAndDelete(jobId);
    await Application.deleteMany({ jobId });

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
