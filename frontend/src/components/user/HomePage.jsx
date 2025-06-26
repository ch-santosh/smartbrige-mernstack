"use client"
import { Link, useNavigate } from "react-router-dom"

const HomePage = () => {
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

      {/* Dashboard Content */}
      <div className="dashboard-container">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="text-center mb-4">Welcome to Your Dashboard</h2>
              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h5>Register New Complaint</h5>
                      <p>Submit a new complaint for resolution</p>
                      <Link to="/user/complaint" className="btn btn-primary">
                        Register Complaint
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h5>Check Status</h5>
                      <p>Track the progress of your complaints</p>
                      <Link to="/user/status" className="btn btn-info">
                        View Status
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

export default HomePage
