import React, { useState, useEffect, useRef } from "react";
import { BiX, BiFace } from "react-icons/bi";
import "./ChatPanel.css";

const ChatPanel = ({ conferenceId, messages, onSendMessage, onClose }) => {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setLocalMessages(messages || []);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setLocalMessages([
        ...localMessages,
        {
          message: input,
          userName: "You",
          timestamp: new Date(),
          messageType: "text",
        },
      ]);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h3>Chat</h3>
        <button className="close-btn" onClick={onClose}>
          <BiX size={24} />
        </button>
      </div>

      <div className="chat-messages">
        {localMessages.length === 0 ? (
          <div className="empty-messages">
            <p>No messages yet</p>
            <span>Start the conversation!</span>
          </div>
        ) : (
          localMessages.map((msg, idx) => (
            <div key={idx} className="message-item">
              <div className="message-avatar">
                <BiFace size={32} />
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">{msg.userName}</span>
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="message-text">{msg.message}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows="3"
        />
        <button onClick={handleSend} disabled={!input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
