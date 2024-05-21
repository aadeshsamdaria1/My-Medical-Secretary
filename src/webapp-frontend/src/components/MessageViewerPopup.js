import React, { useState, useEffect } from "react";
import "../styles/MessageViewerPopup.css";
import { getMesssages, sendMessage, deleteMessage } from "../utils/messagesAPI";

function MessageViewerPopup({ onClose, selectedPatientId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");


  useEffect(() => {
    fetchMessages();
  }, []);


  const fetchMessages = async () => {
    try {
      const fetchedMessages = await getMesssages(selectedPatientId);
      console.log(fetchedMessages);
      setMessages(fetchedMessages.sort((a, b) => new Date(a.timeCreated) - new Date(b.timeCreated)));
      
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      fetchMessages();
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleSendMessage = async () => {

    try {
        await sendMessage({ text: newMessage, patientId: selectedPatientId });
        setNewMessage('');
        fetchMessages();
    } catch (error) {
        console.error("Failed to send message:", error);
    }
  }

  return (
    <div className="message-viewer-popup-overlay">
      <div className="message-viewer-popup">
        <h2 className="popup-title">Messages</h2>
          <div>
            <div className="messages-container">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div key={message.messageId} className="message-item">
                    <div className="message-datetime">{new Date(message.timeCreated).toLocaleString()}</div>
                    <div className="message-text">{message.text}</div>
                    <button className="delete-button" onClick={() => handleDeleteMessage(message.messageId)}>
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-messages">No messages have been sent to this patient</div>
              )}
            </div>
            <div className="send-message-section">
                <h3>Send New Message</h3>
              <input
                  className="message-textbox"
                  type="text"
                  placeholder="Type a new message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
              />
              <button 
                  onClick={handleSendMessage}
                  className="send-button">Send Message</button>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
      </div>
    </div>
  );
};

export default MessageViewerPopup;
