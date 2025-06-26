import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

// Common Components
import Home from "./components/common/Home"
import Login from "./components/common/Login"
import SignUp from "./components/common/SignUp"
import About from "./components/common/About"
import FooterC from "./components/common/FooterC"

// User Components
import HomePage from "./components/user/HomePage"
import Complaint from "./components/user/Complaint"
import Status from "./components/user/Status"

// Agent Components
import AgentHome from "./components/agent/AgentHome"

// Admin Components
import AdminHome from "./components/admin/AdminHome"
import AccordionAdmin from "./components/admin/AccordionAdmin"
import AgentInfo from "./components/admin/AgentInfo"
import UserInfo from "./components/admin/UserInfo"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />

          {/* User Routes */}
          <Route path="/user/home" element={<HomePage />} />
          <Route path="/user/complaint" element={<Complaint />} />
          <Route path="/user/status" element={<Status />} />

          {/* Agent Routes */}
          <Route path="/agent/home" element={<AgentHome />} />

          {/* Admin Routes */}
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/dashboard" element={<AccordionAdmin />} />
          <Route path="/admin/agents" element={<AgentInfo />} />
          <Route path="/admin/users" element={<UserInfo />} />
        </Routes>
        <FooterC />
      </div>
    </Router>
  )
}

export default App
