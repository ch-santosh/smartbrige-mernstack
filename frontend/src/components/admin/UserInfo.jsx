"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const UserInfo = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
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

      {/* Users Management */}
      <div className="dashboard-container">
        <div className="container">
          <h2 className="text-center mb-4">User Management</h2>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center">
              <div className="alert alert-info">No users found.</div>
            </div>
          ) : (
            <div className="row">
              {users.map((userData) => (
                <div key={userData._id} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{userData.name}</h5>
                      <p className="card-text">
                        <strong>Email:</strong> {userData.email}
                        <br />
                        <strong>Phone:</strong> {userData.phone}
                        <br />
                        <strong>User Type:</strong> {userData.userType}
                        <br />
                        <strong>Joined:</strong> {new Date(userData.createdAt).toLocaleDateString()}
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

export default UserInfo
