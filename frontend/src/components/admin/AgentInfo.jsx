"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const AgentInfo = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/agents", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAgents(response.data)
    } catch (error) {
      console.error("Error fetching agents:", error)
    } finally {
      setLoading(false)
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

      {/* Agents Management */}
      <div className="dashboard-container">
        <div className="container">
          <h2 className="text-center mb-4">Agent Management</h2>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : agents.length === 0 ? (
            <div className="text-center">
              <div className="alert alert-info">No agents registered yet.</div>
            </div>
          ) : (
            <div className="row">
              {agents.map((agent) => (
                <div key={agent._id} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{agent.name}</h5>
                      <p className="card-text">
                        <strong>Email:</strong> {agent.email}
                        <br />
                        <strong>Phone:</strong> {agent.phone}
                        <br />
                        <strong>User Type:</strong> {agent.userType}
                        <br />
                        <strong>Joined:</strong> {new Date(agent.createdAt).toLocaleDateString()}
                      </p>
                    </div>
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

export default AgentInfo
