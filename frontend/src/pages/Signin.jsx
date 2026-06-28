import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("developer"); // ✅ renamed

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const signinData = {
      email,
      password,
      userType, // ✅ matches server
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/signin", // ✅ fixed URL
        signinData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert(response.data.message);

      // ✅ correct path to userType
      if (response.data.user.userType === "developer") {
        navigate("/developer/dashboard");
      } else {
        navigate("/recruiter/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card border-info mx-auto" style={{ width: "40%" }}>
        <div className="card-header text-center">
          <h1>Sign In</h1>
        </div>

        <div className="card-body">
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter valid Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Login As</label>
              <select
                className="form-select"
                value={userType}
                onChange={(e) => setUserType(e.target.value)} // ✅ renamed
              >
                <option value="developer">Developer</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>

            <button type="submit" className="btn btn-outline-info w-100">
              Login
            </button>
          </form>
        </div>

        <div className="card-footer text-center">
          Don't have an account? <br />
          <Link to="/api/developerSignup">Register as Developer</Link>
          <br />
          <Link to="/api/recruiterSignup">Register as Recruiter</Link>
        </div>
      </div>
    </div>
  );
}

export default Signin;