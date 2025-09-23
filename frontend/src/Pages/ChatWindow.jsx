import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import './CssPages/ChatWindow.css';

const ChatWindow = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const { chatName, members } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [token, setToken] = useState('');
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState('');
  const messagesEndRef = useRef(null);
  const apiUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const s = io(apiUrl);
    setSocket(s);
    s.on('connect', () => s.emit('join_room', chatId));
    s.on('receive_message', data => setMessages(prev => [...prev, data]));
    return () => s.disconnect();
  }, [chatId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedName = localStorage.getItem('name');
    if (storedToken) { setToken(storedToken); setName(storedName || 'You'); }
  }, []);

  useEffect(() => { if (token) fetchMessages(); }, [token, location]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${apiUrl}/message/getMessages`, {
        params: { conversationId: chatId },
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages || []);
    } catch (err) { console.error(err); }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const msgData = { conversationId: chatId, Content: newMessage, SenderUsername: name };
    try {
      await axios.post(`${apiUrl}/message/sendMessage`, { conversationId: chatId, message: newMessage }, { headers: { Authorization: `Bearer ${token}` } });
      socket?.emit('send_message', msgData);
      setMessages(prev => [...prev, msgData]);
      setNewMessage('');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="chat-window">
      <header className="chat-title">
        <h2>{chatName || 'Chat'}</h2>
        {members && <p className="chat-subtitle">Members: {members.join(', ')}</p>}
      </header>

      <div className="messages-container">
        {messages.length === 0 && <p className="chat-status">No messages yet.</p>}
        {messages.map((msg, i) => {
          const isMine = msg.SenderUsername === name;
          return (
            <div key={i} className={`message ${isMine ? 'message-right' : 'message-left'}`}>
              <span className={isMine ? 'message-right-user' : 'message-left-user'}>
                <strong>{msg.SenderUsername}</strong>
              </span>
              <span className="message-bubble">{msg.Content}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
        />
        <button className="send-button">✈️</button>
      </div>
    </div>
  );
};

export default ChatWindow;