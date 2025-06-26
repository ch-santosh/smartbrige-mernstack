const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const connectDB = require("./config")
const { User, Complaint, AssignedComplaint, Message } = require("./Schema")

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
connectDB()

// JWT Secret
const JWT_SECRET = "your-secret-key-here"

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Access token required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Auth Routes
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, phone, userType } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      userType,
    })

    await user.save()
    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Registration failed", error: error.message })
  }
})

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        userType: user.userType,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Login failed", error: error.message })
  }
})

// Complaint Routes
app.post("/api/complaints", authenticateToken, async (req, res) => {
  try {
    const { name, address, city, state, pincode, comment } = req.body

    const complaint = new Complaint({
      userId: req.user.userId,
      name,
      address,
      city,
      state,
      pincode,
      comment,
      status: "pending",
    })

    await complaint.save()
    res.status(201).json({ message: "Complaint registered successfully", complaint })
  } catch (error) {
    console.error("Complaint creation error:", error)
    res.status(500).json({ message: "Failed to register complaint", error: error.message })
  }
})

app.get("/api/complaints/user", authenticateToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.userId }).sort({ createdAt: -1 })
    res.json(complaints)
  } catch (error) {
    console.error("Error fetching user complaints:", error)
    res.status(500).json({ message: "Failed to fetch complaints", error: error.message })
  }
})

app.get("/api/complaints/all", authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    const complaints = await Complaint.find().populate("userId", "name email").sort({ createdAt: -1 })
    res.json(complaints)
  } catch (error) {
    console.error("Error fetching all complaints:", error)
    res.status(500).json({ message: "Failed to fetch complaints", error: error.message })
  }
})

app.get("/api/complaints/assigned", authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== "agent") {
      return res.status(403).json({ message: "Access denied" })
    }

    const assignedComplaints = await AssignedComplaint.find({ agentId: req.user.userId })
      .populate("complaintId")
      .sort({ createdAt: -1 })

    res.json(assignedComplaints)
  } catch (error) {
    console.error("Error fetching assigned complaints:", error)
    res.status(500).json({ message: "Failed to fetch assigned complaints", error: error.message })
  }
})

app.put("/api/complaints/:id/status", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body
    const complaintId = req.params.id

    // Update complaint status
    await Complaint.findByIdAndUpdate(complaintId, { status })

    // Update assigned complaint status if exists
    await AssignedComplaint.findOneAndUpdate({ complaintId }, { status })

    res.json({ message: "Status updated successfully" })
  } catch (error) {
    console.error("Error updating status:", error)
    res.status(500).json({ message: "Failed to update status", error: error.message })
  }
})

app.post("/api/complaints/:id/assign", authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    const { agentId } = req.body
    const complaintId = req.params.id

    // Get agent details
    const agent = await User.findById(agentId)
    if (!agent || agent.userType !== "agent") {
      return res.status(400).json({ message: "Invalid agent" })
    }

    // Check if already assigned
    const existingAssignment = await AssignedComplaint.findOne({ complaintId })
    if (existingAssignment) {
      return res.status(400).json({ message: "Complaint already assigned" })
    }

    // Create assignment
    const assignment = new AssignedComplaint({
      agentId,
      complaintId,
      agentName: agent.name,
      status: "assigned",
    })

    await assignment.save()

    // Update complaint status
    await Complaint.findByIdAndUpdate(complaintId, { status: "assigned" })

    res.json({ message: "Complaint assigned successfully" })
  } catch (error) {
    console.error("Error assigning complaint:", error)
    res.status(500).json({ message: "Failed to assign complaint", error: error.message })
  }
})

// User Management Routes
app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    const users = await User.find({ userType: "customer" }).select("-password").sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ message: "Failed to fetch users", error: error.message })
  }
})

app.get("/api/agents", authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    const agents = await User.find({ userType: "agent" }).select("-password").sort({ createdAt: -1 })
    res.json(agents)
  } catch (error) {
    console.error("Error fetching agents:", error)
    res.status(500).json({ message: "Failed to fetch agents", error: error.message })
  }
})

// Message Routes
app.post("/api/messages", authenticateToken, async (req, res) => {
  try {
    const { message, complaintId } = req.body

    const newMessage = new Message({
      name: req.user.name,
      message,
      complaintId,
      senderId: req.user.userId,
      senderType: req.user.userType === "customer" ? "customer" : "agent",
    })

    await newMessage.save()
    res.status(201).json({ message: "Message sent successfully" })
  } catch (error) {
    console.error("Error sending message:", error)
    res.status(500).json({ message: "Failed to send message", error: error.message })
  }
})

app.get("/api/messages/:complaintId", authenticateToken, async (req, res) => {
  try {
    const { complaintId } = req.params

    const messages = await Message.find({ complaintId }).sort({ createdAt: 1 })
    res.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    res.status(500).json({ message: "Failed to fetch messages", error: error.message })
  }
})

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running", timestamp: new Date().toISOString() })
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
