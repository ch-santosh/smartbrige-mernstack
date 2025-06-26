"use client"
import { Link, useNavigate } from "react-router-dom"

const AdminHome = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
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
          <div className="row">
            <div className="col-md-12">
              <h2 className="text-center mb-4">Admin Dashboard</h2>
              <div className="row">
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body text-center">
                      <h5>Manage Complaints</h5>
                      <p>View and assign complaints to agents</p>
                      <Link to="/admin/dashboard" className="btn btn-primary">
                        View Complaints
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body text-center">
                      <h5>Manage Users</h5>
                      <p>View and manage user accounts</p>
                      <Link to="/admin/users" className="btn btn-info">
                        View Users
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body text-center">
                      <h5>Manage Agents</h5>
                      <p>View and manage agent accounts</p>
                      <Link to="/admin/agents" className="btn btn-success">
                        View Agents
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
