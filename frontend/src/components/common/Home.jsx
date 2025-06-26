import { Link } from "react-router-dom"

const Home = () => {
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

      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="hero-image">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/website-front-XtvbN05uiik825HDmbsp8fhbKYqgLp.png"
                  alt="Customer Service Representative"
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="hero-content">
                <h1>Empower Your Team,</h1>
                <p>Exceed Customer Expectations: Discover our Complaint Management Solution</p>
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Register your Complaint
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
