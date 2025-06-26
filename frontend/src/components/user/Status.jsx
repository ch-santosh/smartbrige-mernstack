"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import ChatWindow from "../common/ChatWindow"

const Status = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const [complaints, setComplaints] = useState([])
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/complaints/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setComplaints(response.data)
    } catch (error) {
      console.error("Error fetching complaints:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning"
      case "assigned":
        return "info"
      case "in-progress":
        return "primary"
      case "resolved":
        return "success"
      case "closed":
        return "secondary"
      default:
        return "secondary"
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

      {/* Status Dashboard */}
      <div className="dashboard-container">
        <div className="container">
          <h2 className="text-center mb-4">Your Complaints Status</h2>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : complaints.length === 0 ? (
            <div className="text-center">
              <p>No complaints found.</p>
              <Link to="/user/complaint" className="btn btn-primary">
                Register Your First Complaint
              </Link>
            </div>
          ) : (
            <div className="row">
              {complaints.map((complaint) => (
                <div key={complaint._id} className="col-md-6 mb-4">
                  <div className="complaint-card">
                    <div className="complaint-details">
                      <p>
                        <strong>Name:</strong> {complaint.name}
                      </p>
                      <p>
                        <strong>Address:</strong> {complaint.address}
                      </p>
                      <p>
                        <strong>City:</strong> {complaint.city}
                      </p>
                      <p>
                        <strong>State:</strong> {complaint.state}
                      </p>
                      <p>
                        <strong>Pincode:</strong> {complaint.pincode}
                      </p>
                      <p>
                        <strong>Comment:</strong> {complaint.comment}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className={`badge bg-${getStatusColor(complaint.status)}`}>{complaint.status}</span>
                      </p>
                      <p>
                        <strong>Submitted:</strong> {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="d-flex gap-2">
                      <button className="btn btn-primary btn-sm" onClick={() => setSelectedComplaint(complaint._id)}>
                        Message
                      </button>
                    </div>

                    {selectedComplaint === complaint._id && (
                      <ChatWindow complaintId={complaint._id} onClose={() => setSelectedComplaint(null)} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Status
