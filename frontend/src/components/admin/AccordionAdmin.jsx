"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const AccordionAdmin = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const [complaints, setComplaints] = useState([])
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedComplaint, setExpandedComplaint] = useState(null)
  const [expandedAgents, setExpandedAgents] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  useEffect(() => {
    fetchComplaints()
    fetchAgents()
  }, [])

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/complaints/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setComplaints(response.data)
    } catch (error) {
      console.error("Error fetching complaints:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/agents", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAgents(response.data)
    } catch (error) {
      console.error("Error fetching agents:", error)
    }
  }

  const assignComplaint = async (complaintId, agentId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `/api/complaints/${complaintId}/assign`,
        {
          agentId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      fetchComplaints() // Refresh complaints list
      alert("Complaint assigned successfully!")
    } catch (error) {
      console.error("Error assigning complaint:", error)
      alert("Failed to assign complaint")
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
          <Link className="navbar-brand" to="/admin/home">
            ComplaintCare
          </Link>
          <div className="navbar-nav">
            <span className="nav-link">Hi Admin {user.name}</span>
            <Link className="nav-link" to="/admin/dashboard">
              Dashboard
            </Link>
            <Link className="nav-link" to="/admin/users">
              User
            </Link>
            <Link className="nav-link" to="/admin/agents">
              Agent
            </Link>
          </div>
          <button className="btn btn-danger ms-auto" onClick={handleLogout}>
            log out
          </button>
        </div>
      </nav>

      {/* Admin Dashboard */}
      <div className="dashboard-container">
        <div className="container">
          <h2 className="text-center mb-4">Admin Dashboard</h2>

          {/* Users Complaints Section */}
          <div className="accordion-section">
            <div
              className="accordion-header"
              onClick={() => setExpandedComplaint(expandedComplaint ? null : "complaints")}
            >
              <h4>Users Complaints ⌄</h4>
            </div>

            {expandedComplaint === "complaints" && (
              <div className="accordion-content">
                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : complaints.length === 0 ? (
                  <div className="text-center">No complaints found.</div>
                ) : (
                  <div className="row">
                    {complaints.map((complaint) => (
                      <div key={complaint._id} className="col-md-6 mb-3">
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

                          {complaint.status === "pending" && (
                            <div className="dropdown">
                              <button
                                className="btn btn-warning dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                              >
                                Assign
                              </button>
                              <ul className="dropdown-menu">
                                {agents.map((agent) => (
                                  <li key={agent._id}>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => assignComplaint(complaint._id, agent._id)}
                                    >
                                      {agent.name}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Agents Section */}
          <div className="accordion-section">
            <div className="accordion-header" onClick={() => setExpandedAgents(!expandedAgents)}>
              <h4>Agents ⌄</h4>
            </div>

            {expandedAgents && (
              <div className="accordion-content">
                {agents.length === 0 ? (
                  <div className="text-center">
                    <div className="alert alert-info">No Agents to show</div>
                  </div>
                ) : (
                  <div className="row">
                    {agents.map((agent) => (
                      <div key={agent._id} className="col-md-4 mb-3">
                        <div className="card">
                          <div className="card-body">
                            <h6>{agent.name}</h6>
                            <p className="mb-1">Email: {agent.email}</p>
                            <p className="mb-1">Phone: {agent.phone}</p>
                            <small className="text-muted">
                              Joined: {new Date(agent.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccordionAdmin
