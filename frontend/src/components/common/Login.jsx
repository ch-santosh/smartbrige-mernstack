"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("/api/login", formData)

      // Store token and user info
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      // Redirect based on user type
      const userType = response.data.user.userType
      if (userType === "admin") {
        navigate("/admin/home")
      } else if (userType === "agent") {
        navigate("/agent/home")
      } else {
        navigate("/user/home")
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed")
    }
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/">
            ComplaintCare
          </Link>
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/">
              Home
            </Link>
            <Link className="nav-link" to="/signup">
              SignUp
            </Link>
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="container">
        <div className="form-container">
          <h2>Login For Registering the Complaint</h2>
          <p>Please enter your Credentials!</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
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

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>

          <div className="text-center mt-3">
            <span style={{ color: "#bdc3c7" }}>Don't have an account? </span>
            <Link to="/signup" className="text-link">
              SignUp
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
