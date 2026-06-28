import { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import JobDetailsModal from "../components/JobDetailsModal";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import { useJobs } from "../hooks/useJobs";
import { jobAPI } from "../services/jobAPI";
import "../styles/JobSeekerInterface.css";

function DeveloperDashboard() {
  const [activeTab, setActiveTab] = useState("findJobs"); // 'findJobs' or 'myApplications'
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    experience: '',
    location: '',
    type: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);

  // Load jobs using our custom hook
  const { jobs, loading, error, pagination } = useJobs(filters, currentPage);

  // Load the developer's applications
  const loadApplications = async () => {
    setAppsLoading(true);
    try {
      const result = await jobAPI.fetchDeveloperApplications();
      if (result.success) {
        setAppliedJobs(result.data);
        // Extract array of job IDs developer already applied to
        const ids = result.data.map(app => app.jobId?._id).filter(Boolean);
        setAppliedJobIds(ids);
      }
    } catch (err) {
      console.error("Failed to load developer applications", err);
    } finally {
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };

  const handleApply = async (job) => {
    try {
      const result = await jobAPI.applyForJob(job._id);
      if (result.success) {
        alert("Applied successfully!");
        setSelectedJob(null);
        loadApplications(); // Refresh applied list
      } else {
        alert(result.message || "Failed to apply");
      }
    } catch (err) {
      alert(err.message || "An error occurred");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="job-seeker-interface py-2">
      {/* Header */}
      <div 
  className="interface-header shadow-sm mb-4" 
  style={{ backgroundColor: "rgb(30, 30, 45)" }}
>
  <div className="header-content text-start">
    <h1 className="fw-bold text-white">Developer Workspace</h1>
    <p className="mb-0 text-white-50">
      Search for jobs, submit applications, and track progress
    </p>
  </div>
</div>


      {/* Tabs */}
      <ul className="nav nav-tabs mb-4 px-1" style={{ borderBottom: "2px solid #dee2e6" }}>
        <li className="nav-item">
          <button
            onClick={() => setActiveTab("findJobs")}
            className={`nav-link fw-bold px-4 py-2 border-0 bg-transparent ${activeTab === "findJobs" ? "text-primary border-bottom border-primary border-3" : "text-secondary"}`}
            style={{ borderBottom: activeTab === "findJobs" ? "3px solid #764ba2 !important" : "" }}
          >
            Find Jobs
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setActiveTab("myApplications")}
            className={`nav-link fw-bold px-4 py-2 border-0 bg-transparent ${activeTab === "myApplications" ? "text-primary border-bottom border-primary border-3" : "text-secondary"}`}
          >
            My Applications ({appliedJobs.length})
          </button>
        </li>
      </ul>

      {activeTab === "findJobs" ? (
        /* Main Container for Jobs search */
        <div className="interface-container px-1 py-0">
          <div className="interface-wrapper">
            {/* Sidebar with Filters */}
            <aside className="filter-sidebar">
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            </aside>

            {/* Main Content Area */}
            <main className="jobs-content">
              {/* Results Header */}
              <div className="results-header d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold text-dark mb-0 fs-3">
                  Available Jobs
                  {pagination && (
                    <span className="job-count text-secondary small fs-6 font-weight-normal ms-2">
                      ({pagination.totalJobs} total)
                    </span>
                  )}
                </h2>
                <div className="results-info text-secondary">
                  {pagination && (
                    <p className="mb-0">
                      Showing{" "}
                      <strong>
                        {(pagination.currentPage - 1) * 6 + 1}-
                        {Math.min(pagination.currentPage * 6, pagination.totalJobs)}
                      </strong>{" "}
                      of <strong>{pagination.totalJobs}</strong> jobs
                    </p>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="loading-state text-center py-5">
                  <div className="spinner"></div>
                  <p className="text-secondary">Loading jobs from database...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="error-state alert alert-warning p-4 rounded text-center">
                  <p className="fw-bold mb-0">⚠️ {error}</p>
                  <p className="text-secondary small mb-0 mt-1">Please try again later</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && jobs.length === 0 && (
                <div className="empty-state text-center py-5 bg-white rounded border">
                  <div className="empty-icon fs-1 mb-3">🔍</div>
                  <h3 className="fw-bold text-dark">No jobs found</h3>
                  <p className="text-secondary">Try adjusting your filters or search criteria</p>
                </div>
              )}

              {/* Jobs Grid */}
              {!loading && !error && jobs.length > 0 && (
                <div className="jobs-grid">
                  {jobs.map((job) => (
                    <div key={job._id} className="job-grid-item">
                      <JobCard
                        job={job}
                        onViewDetails={handleViewDetails}
                        isApplied={appliedJobIds.includes(job._id)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && pagination && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </main>
          </div>
        </div>
      ) : (
        /* Applications history tab */
        <div className="bg-white p-4 rounded shadow-sm border">
          <h3 className="fw-bold text-dark mb-4 fs-4">Your Applied Jobs</h3>

          {appsLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading applications...</span>
              </div>
              <p className="mt-3 text-secondary">Retrieving your applications...</p>
            </div>
          )}

          {!appsLoading && appliedJobs.length === 0 && (
            <div className="text-center py-5">
              <div className="fs-1 mb-3">💼</div>
              <h4 className="fw-bold">No Applications Yet</h4>
              <p className="text-secondary mb-4">You have not applied for any jobs. Explore and apply to start your career path!</p>
              <button onClick={() => setActiveTab("findJobs")} className="btn btn-primary px-4 py-2 rounded-pill shadow-sm">
                Explore Jobs
              </button>
            </div>
          )}

          {!appsLoading && appliedJobs.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light text-secondary">
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Salary Range</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appliedJobs.map((app) => {
                    const job = app.jobId;
                    if (!job) return null;
                    const salaryRange = job.salary && job.salary.min !== undefined && job.salary.max !== undefined
                      ? `${(job.salary.min / 100000).toFixed(1)} - ${(job.salary.max / 100000).toFixed(1)} LPA`
                      : "Not disclosed";
                    let badgeClass = "bg-secondary";
                    if (app.status === "Shortlisted") badgeClass = "bg-success";
                    if (app.status === "Rejected") badgeClass = "bg-danger";
                    if (app.status === "Applied") badgeClass = "bg-info text-dark";

                    return (
                      <tr key={app._id}>
                        <td>
                          <span onClick={() => handleViewDetails(job)} style={{ cursor: "pointer" }} className="fw-bold text-primary text-decoration-none">
                            {job.title}
                          </span>
                        </td>
                        <td>{job.company}</td>
                        <td>{job.workLocation} ({job.workLocationType})</td>
                        <td>{salaryRange}</td>
                        <td>{new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td>
                          <span className={`badge ${badgeClass} py-2 px-3 rounded-pill`}>{app.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
          isApplied={appliedJobIds.includes(selectedJob._id)}
        />
      )}
    </div>
  );
}

export default DeveloperDashboard;
