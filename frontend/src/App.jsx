import { Routes, Route, Navigate } from "react-router-dom";
import Signin from "./pages/Signin";
import DeveloperSignup from "./pages/DeveloperSignup";
import RecruiterSignup from "./pages/RecruiterSignup";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostEditJob from "./pages/PostEditJob";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/developerSignup" element={<DeveloperSignup />} />
      <Route path="/recruiterSignup" element={<RecruiterSignup />} />

      {/* Developer dashboard */}
      <Route path="/developer" element={
        <ProtectedRoute allowedRole="developer">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<DeveloperDashboard />} />
      </Route>

      {/* Recruiter dashboard */}
      <Route path="/recruiter" element={
        <ProtectedRoute allowedRole="recruiter">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="post-job" element={<PostEditJob mode="post" />} />
        <Route path="edit-job/:id" element={<PostEditJob mode="edit" />} />
      </Route>
    </Routes>
  );
}

export default App;