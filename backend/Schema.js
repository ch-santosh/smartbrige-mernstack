const mongoose = require("mongoose")

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["customer", "agent", "admin"],
      required: true,
    },
  },
  { timestamps: true },
)

// Complaint Schema
const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "in-progress", "resolved", "closed"],
      default: "pending",
    },
  },
  { timestamps: true },
)

// Assigned Complaint Schema
const assignedComplaintSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },
    status: {
      type: String,
      enum: ["assigned", "in-progress", "resolved"],
      default: "assigned",
    },
    agentName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

// Message Schema
const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderType: {
      type: String,
      enum: ["customer", "agent"],
      required: true,
    },
  },
  { timestamps: true },
)

const User = mongoose.model("User", userSchema)
const Complaint = mongoose.model("Complaint", complaintSchema)
const AssignedComplaint = mongoose.model("AssignedComplaint", assignedComplaintSchema)
const Message = mongoose.model("Message", messageSchema)

module.exports = {
  User,
  Complaint,
  AssignedComplaint,
  Message,
}
