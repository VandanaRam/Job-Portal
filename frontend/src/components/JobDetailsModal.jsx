import React, { useEffect } from "react";
import "../styles/JobDetailsModal.css";

const JobDetailsModal = ({ job, onClose, onApply, isApplied }) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  if (!job) return null;

  const salaryRange = job.salary && job.salary.min !== undefined && job.salary.max !== undefined
    ? `${(job.salary.min / 100000).toFixed(1)} - ${(job.salary.max / 100000).toFixed(1)} LPA`
    : "Not disclosed";

  const postedDaysAgo = Math.floor(
    (new Date() - new Date(job.postedDate)) / (1000 * 60 * 60 * 24)
  );

  const logoUrl = job.companyLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.company)}`;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isRecruiter = user.userType === "recruiter";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="job-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <div className="company-info">
            <img src={logoUrl} alt={job.company} className="company-logo" />

            <div>
              <h2>{job.title}</h2>
              <p>{job.company}</p>
            </div>
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <span>Experience</span>
            <h4>{job.experience === 0 ? 'Fresher' : `${job.experience}+ Years`}</h4>
          </div>

          <div className="info-card">
            <span>Employment</span>
            <h4>{job.employmentType || "Full-time"}</h4>
          </div>

          <div className="info-card">
            <span>Work Type</span>
            <h4>{job.workLocationType}</h4>
          </div>

          <div className="info-card">
            <span>Location</span>
            <h4>{job.workLocation}</h4>
          </div>

          <div className="info-card">
            <span>Salary</span>
            <h4 className="salary">{salaryRange}</h4>
          </div>

          <div className="info-card">
            <span>Education</span>
            <h4>{job.education || "Not specified"}</h4>
          </div>

          <div className="info-card">
            <span>Industry</span>
            <h4>{job.industryType || "IT / Software"}</h4>
          </div>

          <div className="info-card">
            <span>Posted</span>
            <h4>{postedDaysAgo <= 0 ? 'Today' : `${postedDaysAgo} Days Ago`}</h4>
          </div>
        </div>

        <div className="section">
          <h3>Job Description</h3>
          <p style={{ whiteSpace: "pre-line" }}>{job.jobDescription}</p>
        </div>

        <div className="section">
          <h3>Required Skills</h3>

          <div className="skills">
            {job.requiredSkills && job.requiredSkills.map((skill, index) => (
              <span key={index} className="skill">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="applicants-box">
          {job.applications || 0} candidates have applied for this job
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>
            Close
          </button>

          {!isRecruiter && (
            <button
              className="primary-btn"
              onClick={() => onApply(job)}
              disabled={isApplied}
            >
              {isApplied ? "Applied" : "Apply Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
