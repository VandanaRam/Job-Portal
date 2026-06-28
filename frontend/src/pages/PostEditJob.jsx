import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobAPI } from "../services/jobAPI";

function PostEditJob({ mode = "post" }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    experience: "",
    workLocationType: "Remote",
    workLocation: "",
    jobDescription: "",
    industryType: "IT / Software",
    employmentType: "Full-time",
    education: "",
    salaryMin: "",
    salaryMax: "",
    requiredSkills: "",
    companyLogo: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (mode === "edit" && id) {
      const getJobDetails = async () => {
        setFetching(true);
        try {
          const result = await jobAPI.fetchJobById(id);
          if (result.success && result.data) {
            const job = result.data;
            setFormData({
              title: job.title || "",
              company: job.company || "",
              experience: job.experience || "",
              workLocationType: job.workLocationType || "Remote",
              workLocation: job.workLocation || "",
              jobDescription: job.jobDescription || "",
              industryType: job.industryType || "IT / Software",
              employmentType: job.employmentType || "Full-time",
              education: job.education || "",
              salaryMin: job.salary?.min || "",
              salaryMax: job.salary?.max || "",
              requiredSkills: job.requiredSkills ? job.requiredSkills.join(", ") : "",
              companyLogo: job.companyLogo || "",
            });
          } else {
            alert("Failed to load job details");
            navigate("/recruiter/dashboard");
          }
        } catch (err) {
          alert("Error fetching job details: " + err.message);
          navigate("/recruiter/dashboard");
        } finally {
          setFetching(false);
        }
      };
      getJobDetails();
    }
  }, [mode, id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: formData.title,
      company: formData.company,
      experience: parseInt(formData.experience) || 0,
      workLocationType: formData.workLocationType,
      workLocation: formData.workLocation,
      jobDescription: formData.jobDescription,
      industryType: formData.industryType,
      employmentType: formData.employmentType,
      education: formData.education,
      salary: {
        min: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        max: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        currency: "INR",
      },
      requiredSkills: formData.requiredSkills,
      companyLogo: formData.companyLogo,
    };

    try {
      if (mode === "post") {
        await jobAPI.postJob(payload);
        alert("Job posted successfully!");
      } else {
        await jobAPI.updateJob(id, payload);
        alert("Job updated successfully!");
      }
      navigate("/recruiter/dashboard");
    } catch (err) {
      alert(err.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading details...</span>
        </div>
        <p className="mt-3 text-secondary">Loading job listing details...</p>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: "800px" }}>
      <div className="card shadow-sm border-0 p-4 bg-white rounded-3">
        <h2 className="fw-bold mb-1 text-dark">{mode === "post" ? "Post a New Job" : "Edit Job Listing"}</h2>
        <p className="text-secondary mb-4">Provide details about the job vacancy to attract potential candidates</p>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Title */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Job Title *</label>
              <input
                type="text"
                name="title"
                required
                className="form-control"
                placeholder="e.g. Senior Frontend Developer"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Company */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Company Name *</label>
              <input
                type="text"
                name="company"
                required
                className="form-control"
                placeholder="e.g. Google"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            {/* Experience */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Min Experience (Years) *</label>
              <input
                type="number"
                name="experience"
                required
                min="0"
                className="form-control"
                placeholder="e.g. 3"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>

            {/* Location Type */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Work Location Type *</label>
              <select
                name="workLocationType"
                className="form-select"
                value={formData.workLocationType}
                onChange={handleChange}
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">On-site</option>
              </select>
            </div>

            {/* Location */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Location *</label>
              <input
                type="text"
                name="workLocation"
                required
                className="form-control"
                placeholder="e.g. Bangalore, India"
                value={formData.workLocation}
                onChange={handleChange}
              />
            </div>

            {/* Salary Min */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Min Salary (INR per annum)</label>
              <input
                type="number"
                name="salaryMin"
                min="0"
                className="form-control"
                placeholder="e.g. 600000"
                value={formData.salaryMin}
                onChange={handleChange}
              />
            </div>

            {/* Salary Max */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Max Salary (INR per annum)</label>
              <input
                type="number"
                name="salaryMax"
                min="0"
                className="form-control"
                placeholder="e.g. 1200000"
                value={formData.salaryMax}
                onChange={handleChange}
              />
            </div>

            {/* Industry Type */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Industry Type *</label>
              <input
                type="text"
                name="industryType"
                required
                className="form-control"
                placeholder="e.g. IT Services"
                value={formData.industryType}
                onChange={handleChange}
              />
            </div>

            {/* Employment Type */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Employment Type *</label>
              <select
                name="employmentType"
                className="form-select"
                value={formData.employmentType}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Education */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Education Requirement *</label>
              <input
                type="text"
                name="education"
                required
                className="form-control"
                placeholder="e.g. B.Tech / B.E. / MCA"
                value={formData.education}
                onChange={handleChange}
              />
            </div>

            {/* Required Skills */}
            <div className="col-12">
              <label className="form-label fw-semibold">Required Skills (comma-separated) *</label>
              <input
                type="text"
                name="requiredSkills"
                required
                className="form-control"
                placeholder="React, Node.js, JavaScript, MongoDB"
                value={formData.requiredSkills}
                onChange={handleChange}
              />
              <span className="text-secondary small">Separate skills with commas.</span>
            </div>

            {/* Company Logo */}
            <div className="col-12">
              <label className="form-label fw-semibold">Company Logo URL (optional)</label>
              <input
                type="url"
                name="companyLogo"
                className="form-control"
                placeholder="https://example.com/logo.png"
                value={formData.companyLogo}
                onChange={handleChange}
              />
              <span className="text-secondary small">Provide an image link, or leave empty to use a stylized logo placeholder.</span>
            </div>

            {/* Job Description */}
            <div className="col-12">
              <label className="form-label fw-semibold">Job Description *</label>
              <textarea
                name="jobDescription"
                required
                rows="6"
                className="form-control"
                placeholder="Provide a comprehensive job description, responsibilities, and qualifications requested..."
                value={formData.jobDescription}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-flex gap-3 justify-content-end mt-4">
            <button
              type="button"
              onClick={() => navigate("/recruiter/dashboard")}
              className="btn btn-outline-secondary px-4 rounded-pill"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary px-4 rounded-pill shadow-sm"
            >
              {loading ? "Submitting..." : mode === "post" ? "Publish Job" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostEditJob;
