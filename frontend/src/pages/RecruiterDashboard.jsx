import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobAPI } from "../services/jobAPI";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const loadRecruiterJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await jobAPI.fetchRecruiterJobs();
      if (result.success) {
        setJobs(result.data);
      } else {
        setError("Failed to fetch jobs");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecruiterJobs();
  }, []);

  const handleDeactivate = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job listing?")) {
      try {
        await jobAPI.deleteJob(jobId);
        alert("Job deleted successfully");
        loadRecruiterJobs(); // Reload jobs
      } catch (err) {
        alert(err.message || "Failed to delete job");
      }
    }
  };

  const handleViewApplicants = async (job) => {
    setSelectedJob(job);
    setShowModal(true);
    setApplicantsLoading(true);
    try {
      const result = await jobAPI.fetchJobApplicants(job._id);
      if (result.success) {
        setApplicants(result.data);
      } else {
        alert("Failed to load applicants");
      }
    } catch (err) {
      alert(err.message || "Error fetching applicants");
    } finally {
      setApplicantsLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">Recruiter Dashboard</h2>
          <p className="text-secondary mb-0">Manage your active job postings and track applicants</p>
        </div>
        <Link to="/recruiter/post-job" className="btn btn-primary d-flex align-items-center px-4 py-2 shadow-sm rounded-pill">
          <span className="fs-5 me-2">+</span> Post a Job
        </Link>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-secondary">Loading your job postings...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger shadow-sm border-0 d-flex align-items-center" role="alert">
          <div className="me-2">!</div>
          <div>{error}</div>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
          <div className="fs-1 mb-3">📋</div>
          <h3 className="fw-bold text-dark">No Jobs Posted Yet</h3>
          <p className="text-secondary mb-4">Get started by creating your first job listing to find great talent!</p>
          <Link to="/recruiter/post-job" className="btn btn-outline-primary px-4 py-2 rounded-pill">
            Post Your First Job
          </Link>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="row g-4">
          {jobs.map((job) => {
            const salaryRange = job.salary && job.salary.min !== undefined && job.salary.max !== undefined
              ? `${(job.salary.min / 100000).toFixed(1)} - ${(job.salary.max / 100000).toFixed(1)} LPA`
              : "Not disclosed";
            return (
              <div className="col-12" key={job._id}>
                <div className="card shadow-sm border-0 bg-white p-3 h-100 position-relative transition-all" style={{ borderLeft: "5px solid #764ba2" }}>
                  <div className="card-body p-2">
                    <div className="row align-items-center">
                      <div className="col-md-5">
                        <h4 className="fw-bold text-dark mb-1">{job.title}</h4>
                        <p className="text-secondary mb-2">{job.company} — <span className="badge bg-light text-dark">{job.workLocationType}</span></p>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                          <span className="text-secondary small me-3">@ {job.workLocation}</span>
                          <span className="text-secondary small me-3"># {job.experience === 0 ? "Fresher" : `${job.experience}+ Yrs`}</span>
                          <span className="text-secondary small">₹ {salaryRange}</span>
                        </div>
                      </div>

                      <div className="col-md-3 text-center my-3 my-md-0">
                        <div className="bg-light p-3 rounded border">
                          <span className="d-block text-secondary small uppercase fw-bold mb-1">Applicants</span>
                          <span className="fs-3 fw-bold text-primary">{job.applications || 0}</span>
                        </div>
                      </div>

                      <div className="col-md-4 text-md-end d-flex flex-wrap gap-2 justify-content-md-end justify-content-start">
                        <button
                          onClick={() => handleViewApplicants(job)}
                          className="btn btn-primary px-3 rounded-pill shadow-sm"
                          disabled={!job.applications}
                        >
                          View Applicants
                        </button>
                        <button
                          onClick={() => navigate(`/recruiter/edit-job/${job._id}`)}
                          className="btn btn-outline-secondary px-3 rounded-pill"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeactivate(job._id)}
                          className="btn btn-outline-danger px-3 rounded-pill"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Applicants Modal */}
      {showModal && selectedJob && (
        <div className="modal-overlay d-flex align-items-center justify-content-center" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="bg-white rounded-3 shadow-lg p-4" style={{ width: "90%", maxWidth: "900px", maxHeight: "85vh", overflowY: "auto" }}>
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <div>
                <h4 className="fw-bold mb-1">Applicants for: {selectedJob.title}</h4>
                <p className="text-secondary mb-0 small">Review the details of candidates who applied for this role</p>
              </div>
              <button onClick={() => setShowModal(false)} className="btn-close" aria-label="Close"></button>
            </div>

            {applicantsLoading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-secondary small">Loading candidates...</p>
              </div>
            )}

            {!applicantsLoading && applicants.length === 0 && (
              <div className="text-center py-5">
                <p className="text-secondary fs-5">No applications received yet.</p>
              </div>
            )}

            {!applicantsLoading && applicants.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light text-secondary">
                    <tr>
                      <th>Candidate</th>
                      <th>Contact</th>
                      <th>Profile Details</th>
                      <th>Links</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((app) => {
                      const dev = app.developerId;
                      if (!dev) return null;
                      return (
                        <tr key={app._id}>
                          <td>
                            <div className="fw-bold text-dark">{dev.fullName}</div>
                            <span className="badge bg-secondary small">{dev.role || "Developer"}</span>
                          </td>
                          <td>
                            <div className="small text-secondary">📧 {dev.email}</div>
                            <div className="small text-secondary">📞 {dev.phone}</div>
                          </td>
                          <td>
                            <div className="small mb-1"><strong>Exp:</strong> {dev.experience === "Fresher" ? "Fresher" : `${dev.experience} years`}</div>
                            <div className="small mb-1"><strong>College/Company:</strong> {dev.collegeOrCompany}</div>
                            <div className="small">
                              <strong>Skills:</strong> <span className="text-primary">{dev.skills}</span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {dev.linkedin && (
                                <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary px-2 rounded-circle" title="LinkedIn">
                                  in
                                </a>
                              )}
                              {dev.github && (
                                <a href={dev.github} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-dark px-2 rounded-circle" title="GitHub">
                                  git
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="text-end border-top pt-3 mt-3">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary px-4 rounded-pill">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;
