import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
function RecruiterSignup() {
  const [formData, setFormData] = useState({
    companyName: "",
    recruiterName: "",
    email: "",
    password: "",
    website: "",
    industry: "",
    companySize: "",
    techStack: "",
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
        "http://localhost:5000/api/recruiterSignup",
        formData
      );

      alert(response.data.message);

      // Clear the form after successful submission
      setFormData({
        companyName: "",
        recruiterName: "",
        email: "",
        password: "",
        website: "",
        industry: "",
        companySize: "",
        techStack: "",
      });

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card border-info shadow mx-auto"
        style={{ width: "50%" }}
      >
        <div className="card-header text-center">
          <h2>Recruiter Sign Up</h2>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">
                Company Name
              </label>

              <input
                type="text"
                name="companyName"
                className="form-control"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Recruiter Name
              </label>

              <input
                type="text"
                name="recruiterName"
                className="form-control"
                value={formData.recruiterName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Work Email
              </label>

              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Password
              </label>

              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Company Website
              </label>

              <input
                type="url"
                name="website"
                className="form-control"
                placeholder="https://company.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Industry
              </label>

              <select
                name="industry"
                className="form-select"
                value={formData.industry}
                onChange={handleChange}
              >
                <option value="">
                  Select Industry
                </option>

                <option value="Software">
                  Software
                </option>

                <option value="AI/ML">
                  AI/ML
                </option>

                <option value="FinTech">
                  FinTech
                </option>

                <option value="Healthcare">
                  Healthcare
                </option>

                <option value="Education">
                  Education
                </option>

                <option value="E-Commerce">
                  E-Commerce
                </option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Company Size
              </label>

              <select
                name="companySize"
                className="form-select"
                value={formData.companySize}
                onChange={handleChange}
              >
                <option value="">
                  Select Company Size
                </option>

                <option value="1-10">
                  1-10
                </option>

                <option value="11-50">
                  11-50
                </option>

                <option value="51-200">
                  51-200
                </option>

                <option value="201-1000">
                  201-1000
                </option>

                <option value="1000+">
                  1000+
                </option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Tech Stack
              </label>

              <input
                type="text"
                name="techStack"
                className="form-control"
                placeholder="React, Node.js, Java, AWS"
                value={formData.techStack}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-outline-info w-100"
            >
              Create Recruiter Account
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

export default RecruiterSignup;