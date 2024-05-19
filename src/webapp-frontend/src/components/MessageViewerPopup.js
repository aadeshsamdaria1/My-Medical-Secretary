import React, { useState, useEffect } from "react";

// TODO Make this file and inport css styles
import "../styles/MessageViewerPopup.css";
//import { getMessagesByPatientId, sendMessage, deleteMessage } from "../utils/messagesAPI";

function MessageViewerPopup({ onClose, selectedPatientId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");


  useEffect(() => {
    fetchMessages();
  }, []);


  const fetchMessages = async () => {
    setMessages( [
        {id:1, text:"Please bring your medicare card tomorrow", dateTime:1680000000000},
        {id:2, text:"Remember to fast before blood test", dateTime:1682000000000},
        {id:3, text: "Please arrive half an hour early to your brain consult", dateTime:1683000000000}
    ])
    return;
    // TODO add these functions once backend messages is implemented
    // try {
    //   const fetchedMessages = await getMessagesByPatientId(selectedPatientId);
    //   setMessages(fetchedMessages.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)));
    // } catch (error) {
    //   console.error('Failed to fetch messages:', error);
    // }
  };

  const handleDeleteMessage = async (messageId) => {
    setMessages(messages.filter(message => message.id !== messageId));
    return
    // TODO add these functions once backend messages is implemented

    // try {
    //   await deleteMessage(messageId);
    //   fetchMessages(); // Refresh the list after deletion
    // } catch (error) {
    //   console.error("Failed to delete message:", error);
    // }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
        const maxId = messages.length > 0 ? Math.max(...messages.map(msg => msg.id)) + 1 : 1;
        const newMessageObject = {
            id: maxId,
            text: newMessage,
            dateTime: Date.now()
          };
        setMessages([...messages, newMessageObject]);
        setNewMessage("");
        return;
        // TODO add these functions once backend messages is implemented
        // try {
        //     await sendMessage({ text: newMessage, patientId: selectedPatientId });
        //     setNewMessage('');
        //     fetchMessages();
        // } catch (error) {
        //     console.error("Failed to send message:", error);
        // }
    }
  };

  return (
    <div className="message-viewer-popup-overlay">
      <div className="message-viewer-popup">
        <h2 className="popup-title">Messages</h2>
        <div>
            <div className="messages-container">
            {messages.map((message) => (
                <div key={message.id} className="message-item">
                <div className="message-datetime">{new Date(message.dateTime).toLocaleString()}</div>
                <div className="message-text">{message.text}</div>
                <button className="delete-button" onClick={() => handleDeleteMessage(message.id)}>
                    Delete
                </button>
                </div>
            ))}
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
}

export default MessageViewerPopup;
