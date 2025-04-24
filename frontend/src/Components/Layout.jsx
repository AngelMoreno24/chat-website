import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './CssComponent/Layout.css';
import axios from 'axios';

const Layout = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [chats, setChats] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.warn('Token not found in localStorage');
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios.get(`http://localhost:7145/chat/getChats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Chats fetched:', response.data);
        setChats(response.data.chats || []);
      })
      .catch(err => {
        console.error(err);
      });
    }
  }, [token]);

  return (
    <div className="layout">
      <nav className="layout__sidebar layout__sidebar--left">
        <h3 className="layout__sidebar-title">Chats</h3>
        <button className="layout__new-chat-btn" onClick={() => navigate('/home')}>Friends</button>
        <button className="layout__new-chat-btn" onClick={() => setIsPopupOpen(true)}>+ New Chat</button>

        <ul className="layout__nav-list">
          {chats.map(chat => (
            <li key={chat.Id} className="layout__nav-item">
              <div className="layout__chat-item">
                <Link
                  to={`/chat/${chat.Id}`}
                  state={{ chatName: chat.Name, members: chat.Members }}
                  className="layout__nav-link"
                >
                  {chat.Name}
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <button onClick={handleLogout} className="layout__logout-btn">Logout</button>
      </nav>

      <div className="layout__content">
        <main className="layout__main">
          <Outlet />
        </main>
      </div>

      <aside className="layout__sidebar layout__sidebar--right">
        <h3>Online Users</h3>
        <p>Coming soon...</p>
      </aside>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup__content">
            <h3>Create New Chat</h3>
            <input
              type="text"
              placeholder="Enter chat name..."
              className="popup__input"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
            />
            <button
              className="popup__send-btn"
              onClick={() => {
                console.log('Create chat:', newChatName);
                setIsPopupOpen(false);
                setNewChatName('');
              }}
              disabled={newChatName.trim() === ''}
            >
              Create Chat
            </button>
            <button className="popup__close-btn" onClick={() => setIsPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;