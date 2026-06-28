import { Link, useNavigate, useLocation } from "react-router-dom";

function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = user.userType;
  const fullName = user.fullName ||user.recruiterName||"User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex flex-column text-white p-3" style={{ width: "240px", backgroundColor: "#1e1e2d", minHeight: "calc(100vh - 60px)" }}>
      <div className="text-center py-3 border-bottom border-secondary mb-4">
        <div className="fs-6 text-white-50">Signed in as:</div>
        <div className="fs-5 fw-bold text-wrap text-info mt-1">{fullName}</div>
        <span className="badge bg-primary text-uppercase mt-1 small" style={{ fontSize: "10px" }}>{userType}</span>
      </div>

      <ul className="nav nav-pills flex-column mb-auto gap-2">
        {userType === "developer" && (
          <li className="nav-item">
            <Link
              to="/developer/dashboard"
              className={`nav-link text-white py-2 px-3 rounded-3 d-flex align-items-center ${isActive("/developer/dashboard") ? "active bg-primary" : ""}`}
              style={{ transition: "all 0.3s" }}
            >
              <span className="me-2"></span> Find & Apply Jobs
            </Link>
          </li>
        )}

        {userType === "recruiter" && (
          <>
            <li className="nav-item">
              <Link
                to="/recruiter/dashboard"
                className={`nav-link text-white py-2 px-3 rounded-3 d-flex align-items-center ${isActive("/recruiter/dashboard") ? "active bg-primary" : ""}`}
                style={{ transition: "all 0.3s" }}
              >
                <span className="me-2">#</span> Manage Jobs
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/recruiter/post-job"
                className={`nav-link text-white py-2 px-3 rounded-3 d-flex align-items-center ${isActive("/recruiter/post-job") ? "active bg-primary" : ""}`}
                style={{ transition: "all 0.3s" }}
              >
                <span className="me-2">+</span> Post a Job
              </Link>
            </li>
          </>
        )}
      </ul>

      <div className="mt-auto pt-4 border-top border-secondary">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 py-2 rounded-pill d-flex align-items-center justify-content-center"
        >
           Logout
        </button>
      </div>
    </div>
  );
}

export default SideNav;