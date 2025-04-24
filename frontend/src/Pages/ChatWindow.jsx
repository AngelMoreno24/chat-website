import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './CssPages/ChatWindow.css';

const ChatWindow = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const { chatName, members } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.warn('Token not found in localStorage');
    }
  }, []);

  // Fetch messages after token is set
  useEffect(() => {
    if (token) {
      fetchMessages(token);
    }
  }, [token]);

  const fetchMessages = async (token) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`http://localhost:7145/message/getMessages`, {
        params: { conversationId: chatId },
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <header className="chat-header">
        <h2 className="chat-title">{chatName || 'Chat'}</h2>
        {members && <p className="chat-subtitle">Members: {members.join(', ')}</p>}
      </header>

      <div className="messages-container">
        {loading && <p className="chat-status">Loading messages...</p>}
        {error && <p className="chat-error">{error}</p>}
        {!loading && messages.length === 0 && <p className="chat-status">No messages yet.</p>}

        {messages.map((message, index) => (
          <div key={index} className="message">
            <strong>{message.SenderUsername}</strong>: {message.Content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;