import React, {useState, useEffect} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './CssPages/ChatWindow.css';
import axios from 'axios';

const ChatWindow = () => {
  const { chatId } = useParams();
  const location = useLocation();

  const { chatName, members } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Load token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.warn('Token not found in localStorage');
    }
  }, []);

  // Fetch friends only after token is set
  useEffect(() => {
    if (token) {
      console.log('Token found:', token); // Debug log
      getFriends(token);
    }
  }, [token]);

  const getFriends = (token) => {
    setLoading(true);
    setError(null);

    console.log('Fetching friends with token:', token); // Debug log

    axios.get(`http://localhost:7145/message/getMessages`, {
      params: {
        conversationId: chatId
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
      })
      .then(response => {
        setMessages(response.data.messages || []);

        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch messages:', err);
        setError('Failed to load messages.');
        setLoading(false);
      });
  };









  return (
    <div className="chat-window">
      <h2 className="chat-title">{chatName || 'Chat'}</h2>
      <div className="messages-container">
        
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className="message">
              <strong>{message.SenderId}</strong>: {message.Content}
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;