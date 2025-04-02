import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './CssComponent/Layout.css';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const navigate = useNavigate();

  // Dummy conversation data (replace with actual backend data)
  const conversations = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Group Chat 1" }
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const sendFriendRequest = () => {
    if (friendName.trim() === '') return;
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setFriendName('');
      alert(`Friend request sent to ${friendName}!`);
    }, 1500);
  };

  return (
    <div className="layout">
      {/* Left Sidebar (Chat Navigation) */}
      <nav className={`layout__sidebar layout__sidebar--left ${isOpen ? 'open' : ''}`}>
        <h3 className="layout__sidebar-title">Chats</h3>
        <ul className="layout__nav-list">
          {conversations.map(chat => (
            <li key={chat.id} className="layout__nav-item">
              <Link to={`/chat/${chat.id}`} className="layout__nav-link" onClick={() => setIsOpen(false)}>
                {chat.name}
              </Link>
            </li>
          ))}
        </ul>
        <button onClick={handleLogout} className="layout__logout-btn">Logout</button>
      </nav>

      {/* Toggle Button for Sidebar */}
      <button className={`layout__toggle-btn ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        ☰ Chats
      </button>

      {/* Main Content (Chat Window) */}
      <div className="layout__content">
        <main className="layout__main">
          <Outlet />
        </main>
      </div>

      {/* Right Sidebar (Online Users / Settings) */}
      <aside className="layout__sidebar layout__sidebar--right">
        <h3>Online Users</h3>
        <p>Coming soon...</p>
        <button className="layout__friend-btn" onClick={() => setIsPopupOpen(true)}>
          Find Friends
        </button>
      </aside>

      {/* Friend Search Popup */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup__content">
            <h3>Find Friends</h3>
            <input
              type="text"
              placeholder="Search by name..."
              className="popup__input"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
            />
            <button
              className="popup__send-btn"
              onClick={sendFriendRequest}
              disabled={friendName.trim() === '' || requestSent}
            >
              {requestSent ? "Request Sent!" : "Send Friend Request"}
            </button>
            <button className="popup__close-btn" onClick={() => setIsPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
