import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function DeveloperSignup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    collegeOrCompany: "",
    role: "",          // ✅ was "jobRole" — must match model field name
    skills: "",
    experience: "",
    linkedin: "",
    github: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/developerSignup`,
        formData
      );

      alert(response.data.message || "Signup Successful!");

      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        collegeOrCompany: "",
        role: "",        // ✅ was "role: """ in reset but "jobRole" in state — now consistent
        skills: "",
        experience: "",
        linkedin: "",
        github: "",
      });

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card border-info shadow mx-auto"
        style={{ width: "50%" }}
      >
        <div className="card-header text-center">
          <h2>Developer Sign Up</h2>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>

            <div className="mb-3">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>College / Company</label>
              <input
                type="text"
                name="collegeOrCompany"
                className="form-control"
                value={formData.collegeOrCompany}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Role</label>
              <select
                name="role"               
                className="form-select"
                value={formData.role}     
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Role</option>  {/* ✅ added disabled */}
                <option value="Student">Student</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Skills</label>
              <input
                type="text"
                name="skills"
                className="form-control"
                placeholder="React, Node.js, Python"
                value={formData.skills}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Experience</label>
              <select
                name="experience"
                className="form-select"
                value={formData.experience}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Experience</option>  {/* ✅ added disabled */}
                <option value="Fresher">Fresher</option>
                <option value="0-1">0-1 Years</option>
                <option value="1-3">1-3 Years</option>
                <option value="3-5">3-5 Years</option>
                <option value="5+">5+ Years</option>
              </select>
            </div>

            <div className="mb-3">
              <label>LinkedIn (optional)</label>
              <input
                type="url"
                name="linkedin"
                className="form-control"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>GitHub (optional)</label>
              <input
                type="url"
                name="github"
                className="form-control"
                value={formData.github}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-outline-info w-100"
            >
              Create Account
            </button>

          </form>
        </div>
        <div className="card-footer text-center">
          Already have an account?
          <Link to="/signin">Login</Link>

        </div>
      </div>

    </div>
  );
}

export default DeveloperSignup;
