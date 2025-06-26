"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const Complaint = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    comment: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      await axios.post("/api/complaints", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setSuccess("Complaint registered successfully!")
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        comment: "",
      })

      setTimeout(() => {
        navigate("/user/status")
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to register complaint")
    }
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/user/home">
            ComplaintCare
          </Link>
          <div className="navbar-nav">
            <span className="nav-link">Hi, {user.name}</span>
            <Link className="nav-link" to="/user/complaint">
              Complaint Register
            </Link>
            <Link className="nav-link" to="/user/status">
              Status
            </Link>
          </div>
          <button className="btn btn-danger ms-auto" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Complaint Form */}
      <div className="container">
        <div className="form-container">
          <h2>Register Your Complaint</h2>
          <p>Please provide detailed information about your complaint</p>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    className="form-control"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Status</label>
                  <input type="text" className="form-control" value="pending" disabled style={{ color: "#999" }} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="comment"
                className="form-control"
                rows="4"
                value={formData.comment}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-success">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Complaint
