"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import ChatWindow from "../common/ChatWindow"

const AgentHome = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const [complaints, setComplaints] = useState([])
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [showChat, setShowChat] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  useEffect(() => {
    fetchAssignedComplaints()
  }, [])

  const fetchAssignedComplaints = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/complaints/assigned", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setComplaints(response.data)
    } catch (error) {
      console.error("Error fetching complaints:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `/api/complaints/${complaintId}/status`,
        {
          status: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      fetchAssignedComplaints() // Refresh the list
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "assigned":
        return "info"
      case "in-progress":
        return "primary"
      case "resolved":
        return "success"
      default:
        return "secondary"
    }
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/agent/home">
            ComplaintCare
          </Link>
          <div className="navbar-nav">
            <span className="nav-link">Hi Agent {user.name}</span>
            <Link className="nav-link" to="/agent/home">
              View Complaints
            </Link>
          </div>
          <button className="btn btn-danger ms-auto" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </nav>

      {/* Agent Dashboard */}
      <div className="dashboard-container">
        <div className="container">
          <h2 className="text-center mb-4">Assigned Complaints</h2>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : complaints.length === 0 ? (
            <div className="text-center">
              <p>No complaints assigned to you yet.</p>
            </div>
          ) : (
            <div className="row">
              {complaints.map((assignedComplaint) => {
                const complaint = assignedComplaint.complaintId
                return (
                  <div key={assignedComplaint._id} className="col-md-6 mb-4">
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
                      </div>

                      <div className="d-flex gap-2 mb-3">
                        <div className="dropdown">
                          <button className="btn btn-warning dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Status Change
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => updateStatus(complaint._id, "in-progress")}
                              >
                                In Progress
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item" onClick={() => updateStatus(complaint._id, "resolved")}>
                                Resolved
                              </button>
                            </li>
                          </ul>
                        </div>

                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setSelectedComplaint(complaint._id)
                            setShowChat(true)
                          }}
                        >
                          Message
                        </button>
                      </div>

                      {selectedComplaint === complaint._id && showChat && (
                        <ChatWindow
                          complaintId={complaint._id}
                          onClose={() => {
                            setSelectedComplaint(null)
                            setShowChat(false)
                          }}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgentHome
