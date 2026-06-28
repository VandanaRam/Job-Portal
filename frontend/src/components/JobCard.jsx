import React from "react";
import "../styles/JobCard.css";

const JobCard = ({ job, onViewDetails, isApplied }) => {
  // Format salary range
  const salaryRange =
    job.salary && job.salary.min !== undefined && job.salary.max !== undefined
      ? `${(job.salary.min / 100000).toFixed(1)} - ${(job.salary.max / 100000).toFixed(1)} LPA`
      : "Not disclosed";

  // Safe logo URL with fallback
  const logoUrl =
    job.companyLogo && job.companyLogo.trim() !== ""
      ? job.companyLogo
      : job.company && job.company.trim() !== ""
      ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.company)}`
      : "https://via.placeholder.com/60?text=Logo";

  return (
    <div className="job-card">
      <div className="job-card-header">
        <img
          src={logoUrl}
          alt={job.company || "Company Logo"}
          className="company-logo"
          onError={(e) => {
            // fallback if image fails to load
            e.target.src = "https://via.placeholder.com/60?text=Logo";
          }}
        />
        <div className="job-card-title-section">
          <h3 className="job-title">{job.title}</h3>
          <p className="company-name">{job.company}</p>
        </div>
      </div>

      <div className="job-card-body">
        <div className="job-info-grid">
          <div className="info-item">
            <span className="label">Experience</span>
            <span className="value">
              {job.experience === 0 ? "Fresher" : `${job.experience}+ years`}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Work Type</span>
            <span className="value">{job.workLocationType}</span>
          </div>
          <div className="info-item">
            <span className="label">Location</span>
            <span className="value">{job.workLocation}</span>
          </div>
          <div className="info-item">
            <span className="label">Salary</span>
            <span className="value salary">{salaryRange}</span>
          </div>
        </div>

        <div className="job-description">
          <p>
            {job.jobDescription
              ? `${job.jobDescription.substring(0, 120)}...`
              : "No description provided."}
          </p>
        </div>

        <div className="skills-section">
          <h5>Required Skills</h5>
          <div className="skills-tags">
            {job.requiredSkills &&
              job.requiredSkills.slice(0, 4).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            {job.requiredSkills && job.requiredSkills.length > 4 && (
              <span className="skill-tag">
                +{job.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>

        <div className="job-card-footer">
          <span className="applications">{job.applications || 0} applications</span>
          <div className="footer-actions">
            {isApplied && (
              <span className="badge bg-success me-2 py-2 px-3 align-self-center">
                Applied
              </span>
            )}
            <button className="btn-view-details" onClick={() => onViewDetails(job)}>
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
