import React, { useState } from 'react';
import axios from 'axios';
import './ChatBotWidget.css'; // Add styles here or use Tailwind if you're using it
 import { apiUrl } from './services/ApplicantAPIService'; // Adjust the import path as needed
const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hi! Ask me anything!' }]);
  const [input, setInput] = useState('');
// const geminiUrl = process.env.REACT_APP_GEMINI_API;
const geminiUrl = `${apiUrl}/api/gemini/chat`;

  const toggleChat = () => setIsOpen(!isOpen);
 
  const sendMessage = async () => {
    if (!input.trim()) return;
 
    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
 
    try {
      const res = await axios.post(
  geminiUrl,
        {
          contents: [{ parts: [{ text: input }] }]
        }
      );
      const botReply = res.data.candidates[0].content.parts[0].text;
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
  };
 
  return (
    <>
      <div className="chat-toggle-button" onClick={toggleChat}>💬</div>
 
      {isOpen && (
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender}`}>{msg.text}</div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};
 
export default ChatBotWidget;
 
 