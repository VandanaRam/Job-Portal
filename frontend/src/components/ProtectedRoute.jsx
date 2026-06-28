import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/signin" />;
  if (allowedRole && user.userType !== allowedRole) return <Navigate to="/signin" />;

  return children;
}

export default ProtectedRoute;