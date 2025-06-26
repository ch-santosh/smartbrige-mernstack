"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"

const ChatWindow = ({ complaintId, onClose }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`/api/messages/${complaintId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessages(response.data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }, [complaintId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        "/api/messages",
        {
          message: newMessage,
          complaintId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setNewMessage("")
      fetchMessages() // Refresh messages
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="message-box">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Message Box</h5>
        {onClose && (
          <button className="btn btn-sm btn-secondary" onClick={onClose}>
            Close
          </button>
        )}
      </div>

      <div className="messages-list">
        {messages.map((message, index) => (
          <div key={index} className="message-item">
            <strong>{message.name}:</strong> {message.message}
            <small className="text-muted d-block">{new Date(message.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <div className="d-flex">
        <input
          type="text"
          className="message-input flex-grow-1"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="btn btn-success ms-2" onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
