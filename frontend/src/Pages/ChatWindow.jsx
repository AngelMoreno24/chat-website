import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './CssPages/ChatWindow.css';
import { io } from 'socket.io-client';

const ChatWindow = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const { chatName, members } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState('');


  const apiUrl = import.meta.env.VITE_BASE_URL;
  const messagesEndRef = useRef(null);

  // Load socket on mount
  useEffect(() => {
    const newSocket = io(`${apiUrl}`);
    setSocket(newSocket);
  
    newSocket.on('connect', () => {
      console.log('🔌 Connected to socket');
      newSocket.emit('join_room', chatId); // 👈 Join room by chat ID
    });
  
    newSocket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
  
    return () => newSocket.disconnect();
  }, [chatId]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    
    if (storedToken) {
      setToken(storedToken);
      setName(name)
    } else {
      console.warn('Token not found in localStorage');
    }
  }, []);

  // Fetch messages after token is set
  useEffect(() => {
    if (token) {
      fetchMessages(token);
    }
  }, [token, location]);

  const fetchMessages = async (token) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${apiUrl}/message/getMessages`, {
        params: { conversationId: chatId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
  
    const messageData = {
      conversationId: chatId,
      Content: newMessage,
      SenderUsername: 'You', // Ideally from auth/user context
    };
  
    try {
      await axios.post(`${apiUrl}/message/sendMessage`,
        {
          conversationId: chatId,
          message: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Emit to socket for real-time update
      if (socket) {
        socket.emit('send_message', messageData);
      }
  
      setMessages((prev) => [...prev, messageData]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="chat-window">
      <header className="chat-title">
        <h2>{chatName || 'Chat'}</h2>
        {members && <p className="chat-subtitle">Members: {members.join(', ')}</p>}
      </header>

      <div className="messages-container">
        {loading && <p className="chat-status">Loading messages...</p>}
        {error && <p className="chat-error">{error}</p>}
        {!loading && messages.length === 0 && <p className="chat-status">No messages yet.</p>}

        {messages.map((message, index) => (
          <div key={index} className="message">
            {message.SenderUsername == name?(
                          <span className="message-left-user"><strong>{message.SenderUsername}</strong></span>

            ):(
                          <span className="message-left"><strong>{message.SenderUsername}</strong></span>

            )}
            <span className="message-right">{message.Content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;